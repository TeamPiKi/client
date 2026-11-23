import { useMutation } from '@tanstack/react-query';

export const usePostFriend = ({ onSuccess }: { onSuccess?: (userId: string) => void } = {}) => {
  const { mutate: postFriendMutation, isPending: isPostFriendPending } = useMutation({
    /** TEMP: 친구 추가 API 연동 전 목 처리 */
    mutationFn: async (_userId: string) => {},
    onSuccess: (_, userId) => onSuccess?.(userId),
  });

  return { postFriendMutation, isPostFriendPending };
};
