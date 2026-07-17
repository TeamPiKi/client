import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import BottomTabBar from '@/components/bottom-tab-bar';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import AddWishHomeDialog from './_components/AddWishHomeDialog';
import CreateTournamentDialog from './_components/CreateTournamentDialog';
import InviteTournamentDialog from './_components/InviteTournamentDialog';
import MemberOnlyToast from './_components/MemberOnlyToast';
import TournamentList from './_components/tournament-list';

function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-gray-50 px-5 pt-padding-top pb-32">
      {/* 상단 헤더 */}
      <Header left={<PiKiLogo />} right={<HeaderIcon name="ALARM" />} />

      <Spacing size={24} />

      {/* 메인 컨텐츠 */}
      <main className="flex w-full flex-col gap-12">
        {/* 로고 + CTA 영역 */}
        <section className="grid grid-cols-2 gap-3 py-2.5">
          <AddWishHomeDialog />
          <CreateTournamentDialog />
          <InviteTournamentDialog />
        </section>

        {/* 진행 중인 토너먼트 */}
        <TournamentList />
      </main>

      {/* 하단 네비게이션 */}
      <BottomTabBar />

      <MemberOnlyToast />
    </div>
  );
}

export default HomePage;
