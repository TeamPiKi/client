import { ERROR_CODE } from '@piki/core';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';
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
  const { mutate: postJoinMutation, isPending: isPostJoinPending } = useMutation({
    mutationFn: postJoin,
    onSuccess: (_, variables) => {
      logAnalyticsEvent(ANALYTICS_EVENT.FRIEND_JOIN, {
        tournament_id: variables.tournamentId,
        identity: 'member',
      });
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const { status, data } = error.response;

      if (status === 409) {
        if (data.code === ERROR_CODE.TOURNAMENT_ALREADY_PARTICIPANT) {
          onAlreadyJoined?.();
          return;
        }

        if (data.code === ERROR_CODE.TOURNAMENT_PARTICIPANT_LIMIT_EXCEEDED) {
          onParticipantsFull?.();
          return;
        }

        /** 그 외 참여 불가 — 초대 링크 만료 · PENDING 아닌 토너먼트 */
        onUnavailable?.();
        return;
      }

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postJoinMutation, isPostJoinPending };
};
