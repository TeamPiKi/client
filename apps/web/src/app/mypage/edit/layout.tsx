import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type MypageEditLayoutProps = {
  children: React.ReactNode;
};

async function MypageEditLayout({ children }: MypageEditLayoutProps) {
  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER') redirect(ROUTES.MYPAGE);

  return children;
}

export default MypageEditLayout;
