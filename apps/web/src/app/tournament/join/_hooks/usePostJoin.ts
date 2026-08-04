import { ERROR_CODE } from '@piki/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postJoin } from '../_apis/postJoin';

type UsePostJoinParams = {
  onAlreadyJoined?: () => void;
  onParticipantsFull?: () => void;
  onUnavailable?: () => void;
};

export const usePostJoin = ({
  onAlreadyJoined,
  onParticipantsFull,
  onUnavailable,
}: UsePostJoinParams = {}) => {
  const {
    mutate: postJoinMutation,
    isPending: isPostJoinPending,
    isError: isPostJoinError,
  } = useMutation({
    mutationFn: postJoin,
    onSuccess: (_, variables) => {
      logAnalyticsEvent(ANALYTICS_EVENT.FRIEND_JOIN, {
        tournament_id: variables.tournamentId,
        identity: 'member',
      });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      if (getApiErrorStatus(error) === 409) {
        const code = getApiErrorCode(error);

        /** 그 외 참여 불가(만료 · PENDING 아님)는 onUnavailable 담당 */
        let handleConflict = onUnavailable;
        if (code === ERROR_CODE.TOURNAMENT_ALREADY_PARTICIPANT) handleConflict = onAlreadyJoined;
        else if (code === ERROR_CODE.TOURNAMENT_PARTICIPANT_LIMIT_EXCEEDED)
          handleConflict = onParticipantsFull;

        /** 콜백 미전달 시 아래 generic 토스트로 fallback — 409 무피드백 방지 */
        if (handleConflict) {
          handleConflict();
          return;
        }
      }

      /**
       * 400: 초대 코드 형식 오류·코드 불일치
       * 404: 토너먼트 존재하지 않음
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postJoinMutation, isPostJoinPending, isPostJoinError };
};
