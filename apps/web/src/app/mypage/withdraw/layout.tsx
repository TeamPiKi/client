import { ERROR_CODE } from '@piki/core';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { getLoginPath } from '@/utils/loginRedirect';
import { getQueryClient } from '@/utils/queryClient';

async function MyPageMemberOnlyLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const redirectPath = headerStore.get('x-redirect-path');
  const queryClient = getQueryClient();

  /** 유저 정보 조회 */
  try {
    const userData = await queryClient.fetchQuery({
      queryKey: ['me'],
      queryFn: getMe,
    });

    if (userData.identityType !== 'MEMBER') redirect(ROUTES.LOGIN);
  } catch (error) {
    if (!isAxiosError<ApiErrorResponseT>(error)) throw error;

    if (error.response?.status === 401 || error.response?.status === 404)
      redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));

    /** 탈퇴한 계정 — 세션은 살아 있어도 진입시키지 않는다 (SSR 은 인터셉터가 없어 여기서 처리) */
    if (error.response?.data.code === ERROR_CODE.USER_DELETED)
      redirect(getLoginPath(null, QUERY_ACTION.VALUE.WITHDRAWN_ACCOUNT));

    throw error;
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default MyPageMemberOnlyLayout;
