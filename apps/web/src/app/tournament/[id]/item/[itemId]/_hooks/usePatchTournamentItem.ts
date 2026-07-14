import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';

import { patchTournamentItem } from '../_apis/patchTournamentItem';
import type { PatchTournamentItemRequestT } from '../_types/tournamentItem';

export const usePatchTournamentItem = (tournamentId: number, tournamentItemId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: patchTournamentItemMutation, isPending: isPatchTournamentItemPending } =
    useMutation({
      mutationFn: (body: Omit<PatchTournamentItemRequestT, 'currency'>) => {
        const formData = new FormData();
        formData.append('name', body.name);
        formData.append('price', String(body.currentPrice));
        formData.append('currency', 'KRW');
        formData.append('image', body.image);
        return patchTournamentItem(tournamentId, tournamentItemId, formData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tournamentItem', tournamentId, tournamentItemId],
        });
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
        router.back();
      },
      onError: error => {
        if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

        const {
          status,
          data: { detail },
        } = error.response;

        const clientErrorMessage = detail ?? '요청을 처리하지 못했습니다.';

        /**
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 or 토너먼트 아이템 존재하지 않음
         * 409: PENDING 상태 아닌 토너먼트
         */
        if (status === 403 || status === 404 || status === 409) {
          toast.error(clientErrorMessage);
          router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
        }
      },
    });

  return { patchTournamentItemMutation, isPatchTournamentItemPending };
};
