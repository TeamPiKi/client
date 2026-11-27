import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postUserBlock } from '@/apis/postUserBlock';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const usePostUserBlock = ({ onSuccess }: { onSuccess?: (userId: string) => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: postUserBlockMutation, isPending: isPostUserBlockPending } = useMutation({
    mutationFn: postUserBlock,
    onSuccess: (_, userId) => {
      /** NOTE: 서버가 차단과 함께 두 사람의 친구 관계를 양방향으로 끊음 */
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.BLOCKED });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      toast.success('사용자를 차단했어요.');
      onSuccess?.(userId);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postUserBlockMutation, isPostUserBlockPending };
};
