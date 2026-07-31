import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postJoin } from '../_apis/postJoin';

type UsePostJoinParams = {
  /** 409(만료·인원 초과 등 참여 불가 상태) — 토스트 대신 화면에서 다이얼로그로 안내한다. */
  onConflict?: () => void;
};

export const usePostJoin = ({ onConflict }: UsePostJoinParams = {}) => {
  const { mutate: postJoinMutation, isPending: isPostJoinPending } = useMutation({
    mutationFn: postJoin,
    onSuccess: (_, variables) => {
      logAnalyticsEvent(ANALYTICS_EVENT.FRIEND_JOIN, {
        tournament_id: variables.tournamentId,
        identity: 'member',
      });
    },
    onError: error => {
      if (isAxiosError<ApiErrorResponseT>(error) && error.response?.status === 409) {
        onConflict?.();
        return;
      }

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postJoinMutation, isPostJoinPending };
};
