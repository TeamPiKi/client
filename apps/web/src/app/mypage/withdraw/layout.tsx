import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getRoleFromToken } from '@/utils/auth';
import { getLoginPath } from '@/utils/loginRedirect';

async function MyPageMemberOnlyLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const redirectPath = headerStore.get('x-redirect-path');

  /** MEMBER 권한 판별 */
  const accessToken = (await cookies()).get('access_token')?.value;
  const role = getRoleFromToken(accessToken);

  /** 토큰이 유효하지 않은 경우 세션 만료 처리 */
  if (role === null) redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));

  /** 멤버가 아닌 경우 마이페이지로 리다이렉트 */
  if (role !== 'MEMBER') redirect(ROUTES.MYPAGE);

  return children;
}

export default MyPageMemberOnlyLayout;
