import LoginRequiredPage from '@/components/common/login-required/LoginRequiredPage';
import { LOGIN_REQUIRED_TITLE } from '@/components/common/login-required/loginRequired.const';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type NotificationLayoutProps = {
  children: React.ReactNode;
};

async function NotificationLayout({ children }: NotificationLayoutProps) {
  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER')
    return (
      <LoginRequiredPage
        title={LOGIN_REQUIRED_TITLE.NOTIFICATION}
        redirectPath={ROUTES.NOTIFICATION}
        location={GUEST_BLOCK_LOCATION.NOTIFICATION_TAB}
      />
    );

  return children;
}

export default NotificationLayout;
