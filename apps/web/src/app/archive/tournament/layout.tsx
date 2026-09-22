import LoginRequiredPage from '@/components/common/login-required/LoginRequiredPage';
import { LOGIN_REQUIRED_TITLE } from '@/components/common/login-required/loginRequired.const';
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
      />
    );

  return children;
}

export default TournamentArchiveLayout;
