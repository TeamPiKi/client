import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postPlayLink } from '../_apis/postPlayLink';

export const usePostPlayLink = (tournamentId: number) => {
  const { mutateAsync: postPlayLinkMutation, isPending: isPostPlayLinkPending } = useMutation({
    mutationFn: () => postPlayLink(tournamentId),
    /** 문구는 훅 레벨에서만 — 호출부(mutateAsync catch)에서 토스트하면 전역 fallback 과 겹친다 */
    onError: error => {
      if (!isAxiosError(error) || !error.response) return;

      const { status } = error.response;
      /** 401(인터셉터)·5xx(전역 안전망)는 전역이 처리한다 */
      if (status === 401 || status >= 500) return;

      /**
       * 403: 플레이 링크로 참여한 토너먼트는 공유 링크 생성 불가
       * 404: 토너먼트 존재하지 않음
       * 409: COMPLETED 아닌 토너먼트·이미 생성된 플레이 링크
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postPlayLinkMutation, isPostPlayLinkPending };
};
