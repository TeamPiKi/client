import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteWishes } from '@/apis/deleteWishes';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const useDeleteWishes = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteWishesMutation, isPending: isDeleteWishesPending } = useMutation({
    mutationFn: deleteWishes,
    onSuccess: (_, wishIds) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      wishIds.forEach(wishId => queryClient.removeQueries({ queryKey: ['wish', wishId] }));
      toast.success(`상품 ${wishIds.length}개를 삭제했어요.`);
      onSuccess?.();
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });

  return { deleteWishesMutation, isDeleteWishesPending };
};
