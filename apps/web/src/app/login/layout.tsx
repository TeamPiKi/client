import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import { ROUTES } from '@/consts/route';
import { getQueryClient } from '@/utils/queryClient';

async function LoginLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const user = await queryClient
    .fetchQuery({
      queryKey: ['me'],
      queryFn: getMe,
    })
    .catch(() => null);

  /** 로그인 페이지에 유효한 멤버 접근 시 홈으로 리다이렉트 */
  if (user?.identityType === 'MEMBER') redirect(ROUTES.HOME);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default LoginLayout;
