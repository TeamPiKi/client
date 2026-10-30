import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { deleteFolder } from '../_apis/deleteFolder';

export const useDeleteFolder = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteFolderMutation, isPending: isDeleteFolderPending } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      onSuccess?.();
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
      if (getApiErrorCode(error) === ERROR_CODE.FOLDER_NOT_FOUND) {
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        onSuccess?.();
      }
    },
  });

  return { deleteFolderMutation, isDeleteFolderPending };
};
