import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { PatchItemRequestT } from '@/types/item';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchTournamentItem } from '../_apis/patchTournamentItem';

export const usePatchTournamentItem = (tournamentId: number, tournamentItemId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: patchTournamentItemMutation, isPending: isPatchTournamentItemPending } =
    useMutation({
      mutationFn: (body: Omit<PatchItemRequestT, 'currency'>) => {
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
        if (isGlobalNetError(error)) return;

        /**
         * 400: 상품 이름·가격 미입력
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 or 토너먼트 아이템 존재하지 않음
         * 409: PENDING 상태 아닌 토너먼트
         */
        toast.error(getApiErrorMessage(error));

        const status = getApiErrorStatus(error);
        if (status === 403 || status === 404 || status === 409)
          router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
    });

  return { patchTournamentItemMutation, isPatchTournamentItemPending };
};
