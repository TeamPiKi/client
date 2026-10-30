import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { FolderT } from '@/types/folder';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postFolderWishesMove } from '../../../_common/_apis/postFolderWishesMove';

type PostFolderWishesMoveVariablesT = {
  targetFolder: Pick<FolderT, 'id' | 'name'>;
  wishIds: number[];
};

export const usePostFolderWishesMove = (
  folderId: number,
  { onSuccess }: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: postFolderWishesMoveMutation, isPending: isPostFolderWishesMovePending } =
    useMutation({
      mutationFn: ({ targetFolder, wishIds }: PostFolderWishesMoveVariablesT) =>
        postFolderWishesMove(folderId, { wishIds, targetFolderId: targetFolder.id }),
      onSuccess: (_, { targetFolder }) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        toast.success(`상품을 '${targetFolder.name}' 폴더로 이동했어요.`);
        onSuccess?.();
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
        if (getApiErrorCode(error) === ERROR_CODE.FOLDER_NOT_FOUND)
          queryClient.invalidateQueries({ queryKey: ['folders'] });
      },
    });

  return { postFolderWishesMoveMutation, isPostFolderWishesMovePending };
};
