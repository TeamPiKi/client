import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import type { PatchItemRequestT } from '@/types/item';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchTournamentItem } from '../_apis/patchTournamentItem';

export const usePatchTournamentItem = (tournamentId: number, tournamentItemId: number) => {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: patchTournamentItemMutation, isPending: isPatchTournamentItemPending } =
    useMutation({
      mutationFn: (body: PatchItemRequestT) => {
        const formData = new FormData();
        if (body.name) formData.append('name', body.name);
        if (body.price) formData.append('price', String(body.price));
        if (body.image) formData.append('image', body.image);
        return patchTournamentItem(tournamentId, tournamentItemId, formData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tournamentItem', tournamentId, tournamentItemId],
        });
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
        backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        const code = getApiErrorCode(error);

        /** 토너먼트가 시작된 경우 */
        if (code === ERROR_CODE.TOURNAMENT_NOT_PENDING) {
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
         * 400: 상품 이름·가격 미입력
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 아이템 존재하지 않음
         */
        toast.error(getApiErrorMessage(error));

        const status = getApiErrorStatus(error);
        if (status === 403 || status === 404)
          router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
      },
    });

  return { patchTournamentItemMutation, isPatchTournamentItemPending };
};
