import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTournament } from '@/apis/deleteTournament';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { clearInviteSent } from '@/utils/inviteSentSession';

export const useDeleteTournament = (tournamentId: number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTournamentMutation, isPending: isDeleteTournamentPending } = useMutation({
    mutationFn: () => deleteTournament(tournamentId),
    onSuccess: () => {
      clearInviteSent(tournamentId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOURNAMENT.LIST.ALL });
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      toast.success('토너먼트를 삭제했어요.');
    },
  });

  return { deleteTournamentMutation, isDeleteTournamentPending };
};
