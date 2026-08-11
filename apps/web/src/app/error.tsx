'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { WarningIconFill } from '@/assets/icons';
import { buttonStyles } from '@/components/button/button.style';
import ErrorScreen from '@/components/common/error-screen';
import { ROUTES } from '@/consts/route';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function Error({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const description = getApiErrorMessage(error);

  return (
    <ErrorScreen
      Icon={WarningIconFill}
      iconClassName="text-icon-warning"
      title="오류가 발생했어요"
      description={description}
    >
      <button
        type="button"
        onClick={reset}
        className={buttonStyles({ variant: 'secondary', size: 'md' })}
      >
        다시 시도
      </button>
      <Link href={ROUTES.HOME} className={buttonStyles({ variant: 'primary', size: 'md' })}>
        홈으로 가기
      </Link>
    </ErrorScreen>
  );
}

export default Error;
