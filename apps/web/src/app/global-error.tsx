'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { ROUTES } from '@/consts/route';
import '@/styles/globals.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

// TODO: 임시 글로벌 에러 페이지 - 디자인 변경 필요
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko" className="h-full bg-gray-100">
      <body className="mx-auto my-0 h-full max-w-120 bg-white antialiased">
        <div className="flex h-screen w-full flex-col items-center justify-center gap-8 px-5">
          <div className="w-full max-w-[400px] text-center">
            <p className="title-lg mb-2">예기치 못한 오류가 발생했습니다</p>
            <p className="body-md text-secondary mb-6">페이지를 새로고침해주세요.</p>

            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left">
              {error.message && (
                <div>
                  <span className="body-sm text-secondary font-medium">에러 메시지: </span>
                  <span className="body-sm text-gray-900">{error.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full max-w-[400px] gap-4">
            <button
              type="button"
              onClick={reset}
              className="body-lg flex-1 rounded-3xl bg-gray-900 py-3 text-center font-medium text-white"
            >
              다시 시도
            </button>
            <Link
              href={ROUTES.HOME}
              className="body-lg flex-1 rounded-3xl bg-gray-100 py-3 text-center font-medium text-gray-900"
            >
              홈으로
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
