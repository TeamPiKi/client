import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { FolderT } from '@/types/folder';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postFolder } from '../_apis/postFolder';
import { FOLDER_NAME_ERROR_CODES } from '../_consts/folder';

type UsePostFolderOptionsT = {
  onSuccess?: (folder: FolderT) => void;
  onNameError?: (message: string) => void;
};

export const usePostFolder = ({ onSuccess, onNameError }: UsePostFolderOptionsT = {}) => {
  const queryClient = useQueryClient();

  const { mutate: postFolderMutation, isPending: isPostFolderPending } = useMutation({
    mutationFn: (name: string) => postFolder({ name }),
    onSuccess: folder => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      onSuccess?.(folder);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      if (onNameError && FOLDER_NAME_ERROR_CODES.includes(getApiErrorCode(error))) {
        onNameError(getApiErrorMessage(error));
        return;
      }

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postFolderMutation, isPostFolderPending };
};
