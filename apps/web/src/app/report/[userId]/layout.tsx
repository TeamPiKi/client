import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type ReportLayoutProps = {
  children: React.ReactNode;
};

async function ReportLayout({ children }: ReportLayoutProps) {
  const role = await getRoleOrRedirect();

  /** TODO: 프로필 페이지 생기면 해당 사용자 프로필로 리다이렉트 */
  if (role !== 'MEMBER') redirect(ROUTES.HOME);

  return children;
}

export default ReportLayout;
