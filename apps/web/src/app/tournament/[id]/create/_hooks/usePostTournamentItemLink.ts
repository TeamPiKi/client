import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import type { AddItemErrorTypeT } from '@/components/common/add-item-error-dialog';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemLink } from '../_apis/postTournamentItemLink';

type UsePostTournamentItemLinkOptionsT = {
  /** 입력 폼처럼 에러를 화면 안에서 안내하는 경우 false — 4xx 토스트를 끈다 */
  showErrorToast?: boolean;
};

export const usePostTournamentItemLink = (
  tournamentId: number,
  { showErrorToast = true }: UsePostTournamentItemLinkOptionsT = {}
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [addItemErrorType, setAddItemErrorType] = useState<AddItemErrorTypeT | null>(null);

  const { mutate: postTournamentItemLinkMutation, isPending: isPostTournamentItemLinkPending } =
    useMutation({
      mutationFn: (url: string) => postTournamentItemLink(tournamentId, url),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        /**
         * 400: 링크 형식 오류·미지원 쇼핑몰·아이템 32개 초과
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 존재하지 않음
         * 409: PENDING 상태 아닌 토너먼트
         */
        const status = getApiErrorStatus(error);
        const apiErrorCode = getApiErrorCode(error);

        if (showErrorToast) toast.error(getApiErrorMessage(error));

        if (status === 403) router.replace(ROUTES.HOME);

        if (apiErrorCode === ERROR_CODE.TOURNAMENT_NOT_PENDING)
          setAddItemErrorType('ALREADY_STARTED');
      },
    });

  return { postTournamentItemLinkMutation, isPostTournamentItemLinkPending, addItemErrorType };
};
