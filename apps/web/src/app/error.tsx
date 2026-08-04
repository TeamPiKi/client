'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { WarningIconFill } from '@/assets/icons';
import { buttonStyles } from '@/components/button/button.style';
import { ROUTES } from '@/consts/route';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function Error({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="h-full bg-bg-layer-basement pt-padding-top">
      <div className="flex flex-col items-center gap-[30px] pt-[calc(253px_-_env(safe-area-inset-top))]">
        <div className="flex flex-col items-center gap-[25px]">
          <WarningIconFill className="size-15 text-icon-warning" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-1-semibold text-text-neutral-primary">오류가 발생했어요</h1>
            <p className="body-1-medium text-text-neutral-tertiary">잠시 후 다시 시도해 주세요</p>
          </div>
        </div>
        <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
}

export default Error;
