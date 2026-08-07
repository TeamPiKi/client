'use client';

import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import { toast } from 'sonner';

import { QUERY_ACTION } from '@/consts/queryAction';
import { useQueryAction } from '@/hooks/useQueryAction';

/** 삭제된 토너먼트 아이템 접근 → create 로 폴백됐을 때 안내 토스트 노출 */
function TournamentItemNotFoundToast() {
  useQueryAction({
    action: QUERY_ACTION.VALUE.TOURNAMENT_ITEM_NOT_FOUND,
    onAction: () => toast.error(ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_NOT_FOUND_ITEM]),
  });

  return null;
}

export default TournamentItemNotFoundToast;
