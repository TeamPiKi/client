import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import type { PatchItemRequestT } from '@/types/item';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchWish } from '../_apis/patchWish';

export const usePatchWish = (wishId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: patchWishMutation, isPending: isPatchWishPending } = useMutation({
    mutationFn: (body: Omit<PatchItemRequestT, 'currency'>) => {
      const formData = new FormData();
      formData.append('name', body.name);
      formData.append('currentPrice', String(body.currentPrice));
      formData.append('currency', 'KRW');
      formData.append('image', body.image);
      return patchWish(wishId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      router.back();
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const { status } = error.response;

      if (status === 401 || status >= 500) return;

      toast.error(getApiErrorMessage(error));

      /**
       * 403: 위시 수정 권한 없음
       * 404: 위시 존재하지 않음
       * 409: 탈퇴한 계정
       */
      if (status === 403 || status === 404 || status === 409) router.replace(ROUTES.WISHLIST);
    },
  });

  return { patchWishMutation, isPatchWishPending };
};
