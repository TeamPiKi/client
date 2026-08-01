import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { deleteWish } from '@/apis/deleteWish';
import type { ApiErrorResponseT } from '@/types/api';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

/** 위시 단건 삭제 */
export const useDeleteWish = (wishId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteWishMutation, isPending: isDeleteWishPending } = useMutation({
    mutationFn: () => deleteWish(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('위시 상품이 삭제되었습니다.');
      router.back();
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const { status } = error.response;

      if (status === 401 || status >= 500) return;

      /**
       * 403: 위시 삭제 권한 없음
       * 404: 위시 존재하지 않음
       * 409: 탈퇴한 계정
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteWishMutation, isDeleteWishPending };
};
