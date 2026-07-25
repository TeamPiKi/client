import * as Sentry from '@sentry/nextjs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMe } from '@/apis/getMe';

export const useGetMe = () => {
  const { data: userData } = useSuspenseQuery({
    queryKey: ['me'],
    queryFn: getMe,
    // 유저 정보는 거의 변하지 않으므로 길게 유지 — 재방문/탭 전환 시 즉시 렌더 범위 확대
    staleTime: 5 * 60 * 1000,
  });

  /** 에러가 어떤 유저에게 발생했는지 식별 (PII 정책상 id만, 이메일/닉네임 제외) */
  useEffect(() => {
    if (userData?.id) Sentry.setUser({ id: userData.id });
  }, [userData?.id]);

  return { userData };
};
