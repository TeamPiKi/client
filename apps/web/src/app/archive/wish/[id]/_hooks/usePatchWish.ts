import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';

import { patchWish } from '../_apis/patchWish';
import type { PatchWishRequestT } from '../_types/wish';

export const usePatchWish = (wishId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: patchWishMutation, isPending: isPatchWishPending } = useMutation({
    mutationFn: (body: Omit<PatchWishRequestT, 'currency'>) => {
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

      const {
        status,
        data: { detail },
      } = error.response;

      const clientErrorMessage = detail ?? '요청을 처리하지 못했습니다.';

      if (status === 400) {
        toast.error(clientErrorMessage);
      } else if (status === 403 || status === 404 || status === 409) {
        toast.error(clientErrorMessage);
        router.replace(ROUTES.WISHLIST);
      }
    },
  });

  return { patchWishMutation, isPatchWishPending };
};
