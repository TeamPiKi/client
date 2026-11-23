import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchFolderVisibility } from '../_apis/patchFolderVisibility';

type PatchFolderVisibilityVariablesT = {
  folderId: number;
  name: string;
  isPublic: boolean;
};

export const usePatchFolderVisibility = () => {
  const queryClient = useQueryClient();

  const { mutate: patchFolderVisibilityMutation } = useMutation({
    mutationFn: ({ folderId, isPublic }: PatchFolderVisibilityVariablesT) =>
      patchFolderVisibility(folderId, { isPublic }),
    onSuccess: (_, { name, isPublic }) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success(`'${name}' 폴더를 ${isPublic ? '공개' : '비공개'}로 전환했어요.`);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
      if (getApiErrorCode(error) === ERROR_CODE.FOLDER_NOT_FOUND) queryClient.invalidateQueries({ queryKey: ['folders'] });
      
    },
  });

  return { patchFolderVisibilityMutation };
};
