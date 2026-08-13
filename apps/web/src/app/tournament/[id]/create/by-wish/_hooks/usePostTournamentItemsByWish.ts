import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { PREV_ITEM_COUNT_KEY } from '@/app/tournament/[id]/create/_consts/tournamentItemBasket';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemsByWish } from '../_apis/postTournamentItemsByWish';

export const usePostTournamentItemsByWish = (tournamentId: number, previousItemCount: number) => {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const {
    mutate: postTournamentItemsByWishMutation,
    isPending: isPostTournamentItemsByWishPending,
  } = useMutation({
    mutationFn: (itemIds: number[]) => postTournamentItemsByWish(tournamentId, { itemIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });

      sessionStorage.setItem(`piki:scrollToLast:${tournamentId}`, '1');
      sessionStorage.setItem(`piki:${PREV_ITEM_COUNT_KEY}:${tournamentId}`, String(previousItemCount));
      backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      const code = getApiErrorCode(error);

      /** 토너먼트가 시작된 경우 */
      if (code === ERROR_CODE.TOURNAMENT_NOT_PENDING) {
        toast.error(getApiErrorMessage(error));
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
        router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
        return;
      }

      /** 토너먼트가 삭제된 경우 */
      if (code === ERROR_CODE.TOURNAMENT_NOT_FOUND) {
        router.replace(
          `${ROUTES.HOME}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.TOURNAMENT_NOT_FOUND}`
        );
        return;
      }

      /**
       * 400: 아이템 32개 초과
       * 403: 토너먼트 참여 권한 없음·위시에 없는 아이템
       * 404: 아이템 존재하지 않음
       * 409: 이미 담은 아이템·아직 추출 중인 상품
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending };
};
