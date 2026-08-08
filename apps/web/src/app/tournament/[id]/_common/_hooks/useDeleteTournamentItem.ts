import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';

import { deleteTournamentItem } from '../_apis/deleteTournamentItem';

export const useDeleteTournamentItem = (tournamentId: number, tournamentItemId: number) => {
  const router = useRouter();
  const pathname = usePathname();
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: deleteTournamentItemMutation, isPending: isDeleteTournamentItemPending } =
    useMutation({
      mutationFn: () => deleteTournamentItem(tournamentId, tournamentItemId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
        queryClient.invalidateQueries({
          queryKey: ['tournamentItem', tournamentId, tournamentItemId],
        });

        if (pathname !== ROUTES.TOURNAMENT_CREATE(tournamentId))
          backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        const code = getApiErrorCode(error);

        /** 토너먼트가 시작됐거나 삭제된 경우 */
        if (
          code === ERROR_CODE.TOURNAMENT_NOT_PENDING ||
          code === ERROR_CODE.TOURNAMENT_NOT_FOUND
        ) {
          queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
          if (pathname !== ROUTES.TOURNAMENT_CREATE(tournamentId))
            router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
          return;
        }

        /** 토너먼트 접근 권한 없는 경우 */
        if (code === ERROR_CODE.TOURNAMENT_FORBIDDEN)
          router.replace(
            `${ROUTES.HOME}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.TOURNAMENT_FORBIDDEN}`
          );

        /**
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 or 아이템 존재하지 않음
         */
        const status = getApiErrorStatus(error);
        if (status === 403 || status === 404) {
          if (pathname !== ROUTES.TOURNAMENT_CREATE(tournamentId))
            router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
        }
      },
    });

  return { deleteTournamentItemMutation, isDeleteTournamentItemPending };
};
