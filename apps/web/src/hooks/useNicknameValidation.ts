import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';

const NICKNAME_MAX_LENGTH = 10;
const WITHDRAW_PREFIX = '탈퇴';
const WITHDRAW_PREFIX_ERROR_TEXT = `'탈퇴'로 시작하는 닉네임은 사용할 수 없습니다.`;

export const useNicknameValidation = (nickname: string, originalNickname: string) => {
  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== originalNickname;
  const hasNickname = trimmedNickname.length > 0;

  let nicknameErrorText: string | null = null;

  if (isNicknameChanged) {
    if (!hasNickname) nicknameErrorText = ERROR_MESSAGE_MAP[ERROR_CODE.USER_NICKNAME_BLANK];
    else if (trimmedNickname.length > NICKNAME_MAX_LENGTH)
      nicknameErrorText = ERROR_MESSAGE_MAP[ERROR_CODE.USER_NICKNAME_TOO_LONG];
    else if (trimmedNickname.startsWith(WITHDRAW_PREFIX))
      nicknameErrorText = WITHDRAW_PREFIX_ERROR_TEXT;
  }

  const isNicknameValid = hasNickname && nicknameErrorText === null;

  return { isNicknameChanged, isNicknameValid, nicknameErrorText, trimmedNickname };
};
