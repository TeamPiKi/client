import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { deleteFolderWishes } from '../../../_common/_apis/deleteFolderWishes';

export const useDeleteFolderWishes = (
  folderId: number,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: deleteFolderWishesMutation, isPending: isDeleteFolderWishesPending } =
    useMutation({
      mutationFn: (wishIds: number[]) => deleteFolderWishes(folderId, { wishIds }),
      onSuccess: (_, wishIds) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        toast.success(`폴더에서 상품 ${wishIds.length}개를 삭제했어요.`);
        onSuccess?.();
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
      },
    });

  return { deleteFolderWishesMutation, isDeleteFolderWishesPending };
};
