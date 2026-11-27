import { ERROR_CODE } from '@piki/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchTournamentNickname } from '../_apis/patchTournamentNickname';

type UsePatchTournamentNicknameParams = {
  onDuplicateNickname?: () => void;
};

export const usePatchTournamentNickname = ({
  onDuplicateNickname,
}: UsePatchTournamentNicknameParams = {}) => {
  const { mutate: patchTournamentNicknameMutation, isPending: isPatchTournamentNicknamePending } =
    useMutation({
      mutationFn: patchTournamentNickname,
      onError: error => {
        if (isGlobalNetError(error)) return;

        if (getApiErrorCode(error) === ERROR_CODE.USER_DUPLICATE_NICKNAME && onDuplicateNickname) {
          onDuplicateNickname();
          return;
        }

        toast.error(getApiErrorMessage(error));
      },
    });

  return { patchTournamentNicknameMutation, isPatchTournamentNicknamePending };
};
