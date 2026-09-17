import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import WishLoginRequired from '@/components/common/wish-login-required';
import { QUERY_ACTION } from '@/consts/queryAction';
import { getRoleFromToken } from '@/utils/auth';
import { getLoginPath } from '@/utils/loginRedirect';

type WishArchiveLayoutProps = {
  children: React.ReactNode;
};

async function WishArchiveLayout({ children }: WishArchiveLayoutProps) {
  const headerStore = await headers();
  const redirectPath = headerStore.get('x-redirect-path');

  /** MEMBER 권한 판별 */
  const accessToken = (await cookies()).get('access_token')?.value;
  const role = getRoleFromToken(accessToken);

  /** 토큰이 유효하지 않은 경우 세션 만료 처리 */
  if (role === null) redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));

  /** 위시 페이지는 멤버가 아니면 로그인 유도 화면을 렌더 */
  if (role !== 'MEMBER') return <WishLoginRequired />;

  return children;
}

export default WishArchiveLayout;
