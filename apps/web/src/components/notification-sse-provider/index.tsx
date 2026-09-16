'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getMeQueryOptions } from '@/apis/getMe';
import { ROUTES } from '@/consts/route';
import { useNotificationSSE } from '@/hooks/useNotificationSSE';
import { getRouteType } from '@/utils/getRouteType';

type NotificationSSEProviderProps = {
  /** 서버 렌더 시점의 access_token 유효 여부 */
  hasInitialToken: boolean;
};

function NotificationSSEProvider({ hasInitialToken }: NotificationSSEProviderProps) {
  const pathname = usePathname();
  const routeType = getRouteType(pathname);

  /** 초대 프리뷰는 무토큰 진입 가능 — 무토큰일 때는 getMe 호출 제외 */
  const isTokenOptionalRoute = pathname.startsWith(ROUTES.TOURNAMENT_JOIN_BY_CODE);

  const enabled =
    !!routeType && routeType !== 'PUBLIC' && (!isTokenOptionalRoute || hasInitialToken);

  const { data: meData } = useQuery({
    ...getMeQueryOptions,
    enabled,
    retry: false,
  });

  useNotificationSSE(!!meData);

  return null;
}

export default NotificationSSEProvider;
