import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postPlayLink } from '../_apis/postPlayLink';

export const usePostPlayLink = (tournamentId: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync: postPlayLinkMutation, isPending: isPostPlayLinkPending } = useMutation({
    mutationFn: () => postPlayLink(tournamentId),
    /** 만료됐다면 새 기한을 받으므로 상세에 들고 있던 만료시각을 갱신한다 */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
    },
    /** 문구는 훅 레벨에서만 — 호출부(mutateAsync catch)에서 토스트하면 전역 fallback 과 겹친다 */
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 403: 플레이 링크로 참여한 토너먼트·주최자가 아닌 경우
       * 404: 토너먼트 존재하지 않음
       * 409: COMPLETED 아닌 토너먼트
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postPlayLinkMutation, isPostPlayLinkPending };
};
