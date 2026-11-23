import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePostUserBlock = ({ onSuccess }: { onSuccess?: (userId: string) => void } = {}) => {
  const { mutate: postUserBlockMutation, isPending: isPostUserBlockPending } = useMutation({
    /** TEMP: 차단 API 연동 전 목 처리 */
    mutationFn: async (_userId: string) => {},
    onSuccess: (_, userId) => {
      toast.success('사용자를 차단했어요.');
      onSuccess?.(userId);
    },
  });

  return { postUserBlockMutation, isPostUserBlockPending };
};
