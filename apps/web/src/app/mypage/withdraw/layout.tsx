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

  /** 탈퇴는 멤버 전용 — 게스트는 로그인 페이지로 */
  if (role !== 'MEMBER') redirect(ROUTES.LOGIN);

  return children;
}

export default MyPageMemberOnlyLayout;
