import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePostBlock = ({ onSuccess }: { onSuccess?: (userId: number) => void } = {}) => {
  const { mutate: postBlockMutation, isPending: isPostBlockPending } = useMutation({
    /** TEMP: 차단 API 연동 전 목 처리 */
    mutationFn: async (_userId: number) => {},
    onSuccess: (_, userId) => {
      toast.success('사용자를 차단했어요.');
      onSuccess?.(userId);
    },
  });

  return { postBlockMutation, isPostBlockPending };
};
