import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import type {
  PostRecordMatchRequestT,
  PostRecordMatchResponseT,
} from '../../_common/_types/tournamentResponse';
import { postRecordMatch } from '../_apis/postRecordMatch';

type UsePostRecordMatchArgs = {
  tournamentId: number;
  onSuccess?: (data: PostRecordMatchResponseT) => void;
};

export const usePostRecordMatch = ({ tournamentId, onSuccess }: UsePostRecordMatchArgs) => {
  const { mutate: postRecordMatchMutation, isPending: isPostRecordMatchPending } = useMutation({
    mutationFn: (body: PostRecordMatchRequestT) => postRecordMatch(tournamentId, body),
    onSuccess,
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 400: 잘못된 선택·라운드 불일치
       * 403: 토너먼트 참여 권한 없음
       * 404: 토너먼트 존재하지 않음
       * 409: IN_PROGRESS 아닌 토너먼트·이미 탈락한 아이템
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postRecordMatchMutation, isPostRecordMatchPending };
};
