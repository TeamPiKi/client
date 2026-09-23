import LoginRequiredPage from '@/components/common/login-required/LoginRequiredPage';
import { LOGIN_REQUIRED_TITLE } from '@/components/common/login-required/loginRequired.const';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type TournamentArchiveLayoutProps = {
  children: React.ReactNode;
};

async function TournamentArchiveLayout({ children }: TournamentArchiveLayoutProps) {
  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER')
    return (
      <LoginRequiredPage
        title={LOGIN_REQUIRED_TITLE.TOURNAMENT_HISTORY}
        redirectPath={ROUTES.TOURNAMENT_HISTORY}
        location={GUEST_BLOCK_LOCATION.TOURNAMENT_TAB}
      />
    );

  return children;
}

export default TournamentArchiveLayout;
