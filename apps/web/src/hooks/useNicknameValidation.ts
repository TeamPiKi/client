import { useGetNicknameCheck } from '@/hooks/useGetNicknameCheck';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const WITHDRAW_PREFIX = '탈퇴';
const WITHDRAW_PREFIX_ERROR_TEXT = `'탈퇴'로 시작하는 닉네임은 사용할 수 없습니다.`;
const DUPLICATE_NICKNAME_ERROR_TEXT = '이미 사용 중인 닉네임이에요.';

export const useNicknameValidation = (nickname: string, originalNickname: string) => {
  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== originalNickname;
  const hasNickname = trimmedNickname.length > 0;
  const hasInvalidPrefix = trimmedNickname.startsWith(WITHDRAW_PREFIX);
  const canCheckNickname = isNicknameChanged && hasNickname && !hasInvalidPrefix;

  const {
    nicknameCheckData,
    nicknameCheckError,
    isNicknameCheckFetching,
    isGetNicknameCheckSuccess,
  } = useGetNicknameCheck(nickname, canCheckNickname);

  let nicknameErrorText: string | null = null;

  if (hasInvalidPrefix) nicknameErrorText = WITHDRAW_PREFIX_ERROR_TEXT;
  else if (canCheckNickname && nicknameCheckError)
    nicknameErrorText = getApiErrorMessage(nicknameCheckError);
  else if (canCheckNickname && nicknameCheckData && !nicknameCheckData.available)
    nicknameErrorText = DUPLICATE_NICKNAME_ERROR_TEXT;

  const isCheckingNickname =
    isNicknameChanged && hasNickname && !hasInvalidPrefix && isNicknameCheckFetching;

  const isNicknameValid =
    hasNickname &&
    (!isNicknameChanged ||
      (canCheckNickname &&
        isGetNicknameCheckSuccess &&
        !isNicknameCheckFetching &&
        nicknameCheckData?.available === true));

  return {
    isCheckingNickname,
    isNicknameChanged,
    isNicknameValid,
    nicknameErrorText,
    trimmedNickname,
  };
};
