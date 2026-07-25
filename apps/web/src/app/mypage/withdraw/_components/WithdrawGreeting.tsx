'use client';

import { useGetMe } from '@/hooks/useGetMe';

/** 탈퇴 안내 문구 — me 캐시는 상위 layout 이 조회·시드하므로 여기서 재조회 없이 읽는다 */
function WithdrawGreeting() {
  const { userData } = useGetMe();

  return (
    <p className="text-center heading-2 text-text-neutral-secondary">
      {userData.nickname}님, PiKi를 떠나시나요?
    </p>
  );
}

export default WithdrawGreeting;
