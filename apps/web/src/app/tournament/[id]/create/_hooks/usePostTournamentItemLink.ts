import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemLink } from '../_apis/postTournamentItemLink';

type UsePostTournamentItemLinkOptionsT = {
  /** 입력 폼처럼 에러를 화면 안에서 안내하는 경우 false — 4xx 토스트를 끈다 */
  showErrorToast?: boolean;
};

export const usePostTournamentItemLink = (
  tournamentId: number,
  { showErrorToast = true }: UsePostTournamentItemLinkOptionsT = {}
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postTournamentItemLinkMutation, isPending: isPostTournamentItemLinkPending } =
    useMutation({
      mutationFn: (url: string) => postTournamentItemLink(tournamentId, url),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        const code = getApiErrorCode(error);

        /** 토너먼트가 시작됐거나 삭제, 존재하지 않는 경우 */
        if (
          code === ERROR_CODE.TOURNAMENT_NOT_PENDING ||
          code === ERROR_CODE.TOURNAMENT_NOT_FOUND
        ) {
          queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
          return;
        }

        /**
         * 400: 링크 형식 오류·미지원 쇼핑몰·아이템 32개 초과
         * 403: 토너먼트 참여 권한 없음
         */
        if (showErrorToast) toast.error(getApiErrorMessage(error));

        if (getApiErrorStatus(error) === 403) router.replace(ROUTES.HOME);
      },
    });

  return { postTournamentItemLinkMutation, isPostTournamentItemLinkPending };
};
