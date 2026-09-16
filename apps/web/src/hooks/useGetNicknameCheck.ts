import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getNicknameCheck } from '@/apis/getNicknameCheck';
import { useDebounce } from '@/hooks/useDebounce';

const NICKNAME_MAX_LENGTH = 10;
const DEBOUNCE_MS = 300;

/**
 * 닉네임 중복 체크 훅.
 * - 입력값을 debounce 후 조회 (불필요한 호출 최소화)
 * - 빈 값 / 길이 초과 / debounce 진행 중에는 조회 비활성
 */
export const useGetNicknameCheck = (nickname: string, enabled = true) => {
  const trimmedNickname = nickname.trim();
  const debouncedNickname = useDebounce(trimmedNickname, DEBOUNCE_MS);
  const isValidLength =
    debouncedNickname.length > 0 && debouncedNickname.length <= NICKNAME_MAX_LENGTH;
  const isPendingDebounce = debouncedNickname !== trimmedNickname;

  const {
    data: nicknameCheckData,
    error: nicknameCheckError,
    isFetching,
    isSuccess: isGetNicknameCheckSuccess,
  } = useQuery({
    queryKey: ['nickname', debouncedNickname],
    queryFn: () => getNicknameCheck(debouncedNickname),
    enabled: enabled && isValidLength,
    placeholderData: keepPreviousData,
    staleTime: 0, // NOTE: 재호출 시 최신 결과를 받아와야 하므로 staleTime 0으로 설정
    retry: false,
  });

  return {
    nicknameCheckData,
    nicknameCheckError,
    isNicknameCheckFetching: isFetching || isPendingDebounce,
    isGetNicknameCheckSuccess,
  };
};
