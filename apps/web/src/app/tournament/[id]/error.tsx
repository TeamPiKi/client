'use client';

import { ERROR_CODE } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { HistoryIconFill, WarningIconFill } from '@/assets/icons';
import { buttonStyles } from '@/components/button/button.style';
import ErrorScreen from '@/components/common/error-screen';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function TournamentError({ error, reset }: Props) {
  const isDeleted = getApiErrorCode(error) === ERROR_CODE.TOURNAMENT_NOT_FOUND;

  useEffect(() => {
    /** 삭제는 정상적인 사용자 상태라 수집하지 않는다 */
    if (isDeleted) return;

    Sentry.captureException(error);
  }, [error, isDeleted]);

  const description = getApiErrorMessage(error);

  return (
    <ErrorScreen
      Icon={isDeleted ? HistoryIconFill : WarningIconFill}
      iconClassName={isDeleted ? 'text-icon-neutral-secondary' : 'text-icon-warning'}
      title={isDeleted ? '삭제된 토너먼트예요' : '오류가 발생했어요'}
      description={description}
    >
      {/* 삭제는 재시도해도 결과가 같으므로 버튼을 주지 않는다 */}
      {!isDeleted && (
        <button
          type="button"
          onClick={reset}
          className={buttonStyles({ variant: 'secondary', size: 'md' })}
        >
          다시 시도
        </button>
      )}
      <Link href={ROUTES.HOME} className={buttonStyles({ variant: 'primary', size: 'md' })}>
        홈으로 가기
      </Link>
    </ErrorScreen>
  );
}

export default TournamentError;
