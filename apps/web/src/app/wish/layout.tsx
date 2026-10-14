import { notFound } from 'next/navigation';

import LoginRequiredPage from '@/components/common/login-required/LoginRequiredPage';
import { LOGIN_REQUIRED_TITLE } from '@/components/common/login-required/loginRequired.const';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type WishLayoutProps = {
  children: React.ReactNode;
};

async function WishLayout({ children }: WishLayoutProps) {
  if (process.env.NEXT_PUBLIC_STAGE === 'production') notFound(); // TEMP

  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER')
    return (
      <LoginRequiredPage
        title={LOGIN_REQUIRED_TITLE.WISH}
        redirectPath={ROUTES.WISH}
        location={GUEST_BLOCK_LOCATION.WISH_TAB}
      />
    );

  return children;
}

export default WishLayout;
