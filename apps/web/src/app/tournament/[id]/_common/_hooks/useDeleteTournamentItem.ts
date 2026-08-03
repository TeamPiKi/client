import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { deleteTournamentItem } from '../_apis/deleteTournamentItem';

export const useDeleteTournamentItem = (tournamentId: number, tournamentItemId: number) => {
  const router = useRouter();
  const pathname = usePathname();
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
          router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        /**
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 or 토너먼트 아이템 존재하지 않음
         * 409: PENDING 상태 아닌 토너먼트
         */
        toast.error(getApiErrorMessage(error));

        const status = getApiErrorStatus(error);
        if (status === 403 || status === 404 || status === 409) {
          if (pathname !== ROUTES.TOURNAMENT_CREATE(tournamentId))
            router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
        }
      },
    });

  return { deleteTournamentItemMutation, isDeleteTournamentItemPending };
};
