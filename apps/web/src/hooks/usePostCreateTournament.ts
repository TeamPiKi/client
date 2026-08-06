import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postCreateTournament } from '@/apis/postCreateTournament';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';

export const usePostCreateTournament = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postCreateTournamentMutation, isPending: isPostCreateTournamentPending } =
    useMutation({
      mutationFn: postCreateTournament,
      onSuccess: ({ tournamentId }) => {
        logAnalyticsEvent(ANALYTICS_EVENT.TOURNAMENT_CREATE, { tournament_id: tournamentId });
        // 홈의 진행 중인 토너먼트 리스트 갱신
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOURNAMENT.LIST.ALL });
        router.push(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
    });

  return { postCreateTournamentMutation, isPostCreateTournamentPending };
};
