import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteFriend = ({ onSuccess }: { onSuccess?: (userId: number) => void } = {}) => {
  const { mutate: deleteFriendMutation, isPending: isDeleteFriendPending } = useMutation({
    /** TEMP: 친구 삭제 API 연동 전 목 처리 */
    mutationFn: async (_userId: number) => {},
    onSuccess: (_, userId) => {
      toast.success('친구를 삭제했어요.');
      onSuccess?.(userId);
    },
  });

  return { deleteFriendMutation, isDeleteFriendPending };
};
