import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTournament } from '@/apis/deleteTournament';

export const useDeleteTournament = (tournamentId: number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTournamentMutation, isPending: isDeleteTournamentPending } = useMutation({
    mutationFn: () => deleteTournament(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournamentList'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      toast.success('토너먼트를 삭제했어요.');
    },
  });

  return { deleteTournamentMutation, isDeleteTournamentPending };
};
