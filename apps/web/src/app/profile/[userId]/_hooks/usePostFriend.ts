import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postFriend } from '../_apis/postFriend';

export const usePostFriend = () => {
  const queryClient = useQueryClient();

  const { mutate: postFriendMutation, isPending: isPostFriendPending } = useMutation({
    mutationFn: postFriend,
    onSuccess: async (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPLORE.FRIENDS });
      queryClient.invalidateQueries({ queryKey: ['explore', 'friend-wishes'] });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(userId) });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postFriendMutation, isPostFriendPending };
};
