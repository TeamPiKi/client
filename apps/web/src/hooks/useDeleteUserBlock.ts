import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteUserBlock = ({
  onSuccess,
}: { onSuccess?: (userId: string) => void } = {}) => {
  const { mutate: deleteUserBlockMutation, isPending: isDeleteUserBlockPending } = useMutation({
    /** TEMP: 차단 해제 API 연동 전 목 처리 */
    mutationFn: async (_userId: string) => {},
    onSuccess: (_, userId) => {
      toast.success('차단을 해제했어요.');
      onSuccess?.(userId);
    },
  });

  return { deleteUserBlockMutation, isDeleteUserBlockPending };
};
