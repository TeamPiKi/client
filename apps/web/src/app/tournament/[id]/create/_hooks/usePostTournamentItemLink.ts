import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import type { ApiErrorResponseT } from '@/types/api';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemLink } from '../_apis/postTournamentItemLink';

export const usePostTournamentItemLink = (tournamentId: number) => {
  const queryClient = useQueryClient();

  const { mutate: postTournamentItemLinkMutation, isPending: isPostTournamentItemLinkPending } =
    useMutation({
      mutationFn: (url: string) => postTournamentItemLink(tournamentId, url),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      },
      onError: error => {
        if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

        if (error.response.status < 500) {
          toast.error(getApiErrorMessage(error));
          return;
        }

        throw error;
      },
    });

  return { postTournamentItemLinkMutation, isPostTournamentItemLinkPending };
};
