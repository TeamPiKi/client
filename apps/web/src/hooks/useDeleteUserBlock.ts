import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteUserBlock } from '@/apis/deleteUserBlock';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const useDeleteUserBlock = ({
  onSuccess,
}: { onSuccess?: (userId: string) => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUserBlockMutation, isPending: isDeleteUserBlockPending } = useMutation({
    mutationFn: deleteUserBlock,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.BLOCKED });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      toast.success('차단을 해제했어요.');
      onSuccess?.(userId);
      return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(userId) });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteUserBlockMutation, isDeleteUserBlockPending };
};
