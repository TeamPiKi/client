import { ERROR_CODE, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { setCookie } from '@/utils/cookie';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { postJoinGuest } from '../_apis/postJoinGuest';

type UsePostJoinGuestParams = {
  /** 닉네임 선점 경쟁에서 밀린 경우 — 프리뷰에서 재입력 유도 */
  onDuplicateNickname?: () => void;
  onParticipantsFull?: () => void;
  onAlreadyStarted?: () => void;
  onUnavailable?: () => void;
  onDeleted?: () => void;
};

export const usePostJoinGuest = ({
  onDuplicateNickname,
  onParticipantsFull,
  onAlreadyStarted,
  onUnavailable,
  onDeleted,
}: UsePostJoinGuestParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate: postJoinGuestMutation, isPending: isPostJoinGuestPending } = useMutation({
    mutationFn: postJoinGuest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ME });

      /** 웹은 Set-Cookie 로 자동 저장 — 웹뷰만 body 토큰을 쿠키·네이티브에 동기화 (usePostGuestLogin 과 동일) */
      if (isWebview() && data.accessToken && data.refreshToken) {
        setCookie('access_token', data.accessToken, { minutes: 15 });
        setCookie('refresh_token', data.refreshToken, { days: 14 });
        WebBridge.postMessage({
          type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_TOKEN_REFRESHED,
          payload: { accessToken: data.accessToken, refreshToken: data.refreshToken },
        });
      }

      logAnalyticsEvent(ANALYTICS_EVENT.FRIEND_JOIN, {
        tournament_id: variables.tournamentId,
        identity: 'guest',
      });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      const apiErrorCode = getApiErrorCode(error);

      /** 중복 체크 통과 후 참여 사이에 닉네임을 선점당한 경우 */
      if (apiErrorCode === ERROR_CODE.USER_DUPLICATE_NICKNAME && onDuplicateNickname) {
        onDuplicateNickname();
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

  return { postJoinGuestMutation, isPostJoinGuestPending };
};
