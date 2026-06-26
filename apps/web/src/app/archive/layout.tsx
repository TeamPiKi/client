import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import { QUERY_ACTION } from '@/consts/queryAction';
import type { ApiErrorResponseT } from '@/types/api';
import { getLoginPath } from '@/utils/loginRedirect';
import { getQueryClient } from '@/utils/queryClient';

type ArchiveLayoutProps = {
  children: React.ReactNode;
};

async function ArchiveLayout({ children }: ArchiveLayoutProps) {
  const headerStore = await headers();
  const redirectPath = headerStore.get('x-redirect-path');
  const queryClient = getQueryClient();

  /** MEMBER 권한 조회 - 멤버 권한 없으면 로그인 페이지로 리다이렉트 */
  try {
    const user = await queryClient.fetchQuery({
      queryKey: ['me'],
      queryFn: getMe,
    });
    if (user.identityType !== 'MEMBER') redirect(getLoginPath(redirectPath));
  } catch (error) {
    if (!isAxiosError<ApiErrorResponseT>(error)) throw error;

    if (error.response?.status === 401 || error.response?.status === 404)
      redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));

    throw error;
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default ArchiveLayout;
