import { ERROR_CODE } from '@piki/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postJoin } from '../_apis/postJoin';

type UsePostJoinParams = {
  onAlreadyJoined?: () => void;
  onParticipantsFull?: () => void;
  onAlreadyStarted?: () => void;
  onUnavailable?: () => void;
  onDeleted?: () => void;
};

export const usePostJoin = ({
  onAlreadyJoined,
  onParticipantsFull,
  onAlreadyStarted,
  onUnavailable,
  onDeleted,
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

      const apiErrorCode = getApiErrorCode(error);

      /** 이미 참여한 경우 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_ALREADY_PARTICIPANT && onAlreadyJoined) {
        onAlreadyJoined();
        return;
      }
      /** 정원 초과 경우 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_PARTICIPANT_LIMIT_EXCEEDED && onParticipantsFull) {
        onParticipantsFull();
        return;
      }
      /** 토너먼트가 시작된 경우 — 미리보기(RSC)와 같은 code 는 같은 안내로 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_NOT_PENDING && onAlreadyStarted) {
        onAlreadyStarted();
        return;
      }
      /** 초대 만료 경우 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_INVITE_EXPIRED && onUnavailable) {
        onUnavailable();
        return;
      }

      /** 삭제됐거나 존재하지 않는 토너먼트인 경우 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_NOT_FOUND && onDeleted) {
        onDeleted();
        return;
      }

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postJoinMutation, isPostJoinPending, isPostJoinError };
};
