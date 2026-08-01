'use client';

import { SERVER_ERROR_MESSAGE, getErrorMessageByCode } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';

import { WarningIconFill } from '@/assets/icons';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * 5xx 도 사유가 갈린다
 * — COMMON-SERVER-ERROR(500)
 * — COMMON-RETRYABLE(502)
 * — COMMON-SERVER-BUSY(503)
 */
const getErrorDescription = (error: unknown) => {
  if (!isAxiosError<ApiErrorResponseT>(error)) return SERVER_ERROR_MESSAGE;

  return getErrorMessageByCode(error.response?.data.code) ?? SERVER_ERROR_MESSAGE;
};

function Error({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center gap-6 bg-bg-layer-basement pt-40">
      <div className="flex flex-col items-center gap-4">
        <WarningIconFill className="size-20 text-icon-error" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="heading-1-bold text-text-neutral-secondary">오류가 발생했어요.</h1>
          <p className="body-1-semibold text-text-neutral-tertiary">{getErrorDescription(error)}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center justify-center rounded-[12px] border-[1.2px] border-gray-200 bg-bg-layer-floating px-[18px] py-[10px] body-1-semibold text-text-neutral-primary"
        >
          다시 시도
        </button>
        <Link
          href={ROUTES.HOME}
          className="inline-flex cursor-pointer items-center justify-center rounded-[12px] border border-bg-neutral-primary bg-bg-neutral-primary px-[18px] py-[10px] body-1-semibold text-text-neutral-inverse"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}

export default Error;
