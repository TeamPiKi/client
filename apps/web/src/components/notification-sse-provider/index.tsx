'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getMeQueryOptions } from '@/apis/getMe';
import { ROUTES } from '@/consts/route';
import { useNotificationSSE } from '@/hooks/useNotificationSSE';
import { getRouteType } from '@/utils/getRouteType';

function NotificationSSEProvider() {
  const pathname = usePathname();
  const routeType = getRouteType(pathname);

  /** 초대 프리뷰는 무토큰 진입 가능 — getMe 401 이 세션 만료 리다이렉트를 유발하므로 제외 */
  const isTokenOptionalRoute = pathname.startsWith(ROUTES.TOURNAMENT_JOIN_BY_CODE);

  const enabled = !!routeType && routeType !== 'PUBLIC' && !isTokenOptionalRoute;

  const { data: meData } = useQuery({
    ...getMeQueryOptions,
    enabled,
    retry: false,
  });

  useNotificationSSE(!!meData);

  return null;
}

export default NotificationSSEProvider;
