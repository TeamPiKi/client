import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postUserReport } from '../_apis/postUserReport';
import type { PostUserReportRequestT } from '../_types/report';

type PostUserReportVariablesT = PostUserReportRequestT & { userId: string };

export const usePostUserReport = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: postUserReportMutation, isPending: isPostUserReportPending } = useMutation({
    mutationFn: ({ userId, ...body }: PostUserReportVariablesT) => postUserReport(userId, body),
    onSuccess: (_, { userId }) => {
      /** NOTE: 서버가 신고와 함께 상대를 차단하고 친구 관계를 끊음 */
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND.BLOCKED });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      toast.success('신고가 접수됐어요');
      onSuccess?.();
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postUserReportMutation, isPostUserReportPending };
};
