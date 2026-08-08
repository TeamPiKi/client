'use client';

import { getErrorMessageByCode } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { WarningIconFill } from '@/assets/icons';
import { buttonStyles } from '@/components/button/button.style';
import ErrorScreen from '@/components/common/error-screen';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode } from '@/utils/apiError';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 서버 code 가 있으면 카탈로그 문구로 대체된다 — COMMON-SERVER-ERROR(500)·RETRYABLE(502)·SERVER-BUSY(503) */
const DEFAULT_DESCRIPTION = '잠시 후 다시 시도해 주세요';

function Error({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const description = getErrorMessageByCode(getApiErrorCode(error)) ?? DEFAULT_DESCRIPTION;

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
