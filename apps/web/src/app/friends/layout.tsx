import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type FriendsLayoutProps = {
  children: React.ReactNode;
};

async function FriendsLayout({ children }: FriendsLayoutProps) {
  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER') redirect(ROUTES.HOME);

  return children;
}

export default FriendsLayout;
