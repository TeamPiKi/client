import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchFolder } from '../_apis/patchFolder';
import { FOLDER_NAME_ERROR_CODES } from '../_consts/folder';

type PatchFolderVariablesT = {
  folderId: number;
  name: string;
};

type UsePatchFolderOptionsT = {
  onSuccess?: () => void;
  onNameError?: (message: string) => void;
};

export const usePatchFolder = ({ onSuccess, onNameError }: UsePatchFolderOptionsT = {}) => {
  const queryClient = useQueryClient();

  const { mutate: patchFolderMutation, isPending: isPatchFolderPending } = useMutation({
    mutationFn: ({ folderId, name }: PatchFolderVariablesT) => patchFolder(folderId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      onSuccess?.();
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      const code = getApiErrorCode(error);
      if (onNameError && FOLDER_NAME_ERROR_CODES.includes(code)) {
        onNameError(getApiErrorMessage(error));
        return;
      }

      toast.error(getApiErrorMessage(error));
      if (code === ERROR_CODE.FOLDER_NOT_FOUND) {
        queryClient.invalidateQueries({ queryKey: ['folders'] });
        onSuccess?.();
      }
    },
  });

  return { patchFolderMutation, isPatchFolderPending };
};
