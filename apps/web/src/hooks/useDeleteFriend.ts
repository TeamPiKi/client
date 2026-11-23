import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteFriend } from '@/apis/deleteFriend';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const useDeleteFriend = ({ onSuccess }: { onSuccess?: (userId: string) => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteFriendMutation, isPending: isDeleteFriendPending } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPLORE.FRIENDS });
      queryClient.invalidateQueries({ queryKey: ['explore', 'friend-wishes'] });
      toast.success('친구를 삭제했어요.');
      onSuccess?.(userId);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteFriendMutation, isDeleteFriendPending };
};
