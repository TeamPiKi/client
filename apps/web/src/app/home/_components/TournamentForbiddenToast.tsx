'use client';

import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import { toast } from 'sonner';

import { QUERY_ACTION } from '@/consts/queryAction';
import { useQueryAction } from '@/hooks/useQueryAction';

/** 참여 권한 없는 토너먼트 접근 → 홈으로 폴백됐을 때 안내 토스트 노출 */
function TournamentForbiddenToast() {
  useQueryAction({
    action: QUERY_ACTION.VALUE.TOURNAMENT_FORBIDDEN,
    onAction: () => toast.error(ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_FORBIDDEN]),
  });

  return null;
}

export default TournamentForbiddenToast;
