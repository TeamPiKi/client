'use client';

import { toast } from 'sonner';

import { QUERY_ACTION } from '@/consts/queryAction';
import { useQueryAction } from '@/hooks/useQueryAction';

/** 게스트가 회원 전용 경로 진입 시도 → 홈으로 폴백됐을 때 안내 토스트 노출 */
function MemberOnlyToast() {
  useQueryAction({
    action: QUERY_ACTION.VALUE.MEMBER_ONLY,
    onAction: () => toast.info('회원만 이용할 수 있는 기능이에요.'),
  });

  return null;
}

export default MemberOnlyToast;
