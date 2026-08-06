import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { type PatchInviteExpiryRequestT, patchInviteExpiry } from '../_apis/patchInviteExpiry';

export const usePatchInviteExpiry = (tournamentId: number) => {
  const queryClient = useQueryClient();

  const { mutate: patchInviteExpiryMutation, isPending: isPatchInviteExpiryPending } = useMutation({
    mutationFn: (body: PatchInviteExpiryRequestT) => patchInviteExpiry(tournamentId, body),
    onSuccess: () => {
      logAnalyticsEvent(ANALYTICS_EVENT.INVITE_EXPIRY_CHANGE, { tournament_id: tournamentId });
      // 토너먼트 단건 조회 캐시 무효화 → 시트의 마감 시각 갱신.
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
    },
    /** 문구는 훅 레벨에서만 — mutate 레벨 onError 는 전역 fallback 을 양보시키지 못해 토스트가 두 번 뜬다 */
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 400: 마감 시각 형식 오류
       * 403: 토너먼트 수정 권한 없음
       * 404: 토너먼트 존재하지 않음
       * 409: PENDING 상태 아닌 토너먼트
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { patchInviteExpiryMutation, isPatchInviteExpiryPending };
};
