import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import WishLoginRequired from '@/components/common/wish-login-required';
import { QUERY_ACTION } from '@/consts/queryAction';
import type { ApiErrorResponseT } from '@/types/api';
import type { UserT } from '@/types/user';
import { getLoginPath } from '@/utils/loginRedirect';
import { getQueryClient } from '@/utils/queryClient';

type WishArchiveLayoutProps = {
  children: React.ReactNode;
};

async function WishArchiveLayout({ children }: WishArchiveLayoutProps) {
  const headerStore = await headers();
  const redirectPath = headerStore.get('x-redirect-path');
  const queryClient = getQueryClient();

  /** MEMBER 권한 조회 - 멤버 권한 없으면 로그인 페이지로 리다이렉트 */
  let user: UserT;
  try {
    user = await queryClient.fetchQuery({
      queryKey: ['me'],
      queryFn: getMe,
    });
  } catch (error) {
    if (!isAxiosError<ApiErrorResponseT>(error)) throw error;

    if (error.response?.status === 401 || error.response?.status === 404)
      redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));

    throw error;
  }

  /** 위시 페이지는 멤버가 아니면 로그인 유도 화면을 렌더 */
  if (user.identityType !== 'MEMBER') return <WishLoginRequired />;

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default WishArchiveLayout;
