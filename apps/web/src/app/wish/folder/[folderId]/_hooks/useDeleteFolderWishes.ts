import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { FolderWishSelectionT } from '@/types/folder';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { deleteFolderWishes } from '../../../_common/_apis/deleteFolderWishes';

type DeleteFolderWishesVariablesT = {
  selection: FolderWishSelectionT;
  count: number;
};

export const useDeleteFolderWishes = (
  folderId: number,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: deleteFolderWishesMutation, isPending: isDeleteFolderWishesPending } =
    useMutation({
      mutationFn: ({ selection }: DeleteFolderWishesVariablesT) =>
        deleteFolderWishes(folderId, selection),
      onSuccess: (_, { count }) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        toast.success(`폴더에서 상품 ${count}개를 삭제했어요.`);
        onSuccess?.();
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
      },
    });

  return { deleteFolderWishesMutation, isDeleteFolderWishesPending };
};
