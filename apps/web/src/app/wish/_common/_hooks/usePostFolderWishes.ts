import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { FolderT } from '@/types/folder';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postFolderWishes } from '../_apis/postFolderWishes';

type PostFolderWishesVariablesT = {
  folder: Pick<FolderT, 'id' | 'name'>;
  wishIds: number[];
};

export const usePostFolderWishes = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: postFolderWishesMutation, isPending: isPostFolderWishesPending } = useMutation({
    mutationFn: ({ folder, wishIds }: PostFolderWishesVariablesT) =>
      postFolderWishes(folder.id, { wishIds }),
    onSuccess: (_, { folder }) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success(`상품을 '${folder.name}' 폴더로 이동했어요.`);
      onSuccess?.();
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));

      const code = getApiErrorCode(error);
      if (code === ERROR_CODE.FOLDER_NOT_FOUND)
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      if (code === ERROR_CODE.WISH_NOT_FOUND)
        queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });

  return { postFolderWishesMutation, isPostFolderWishesPending };
};
