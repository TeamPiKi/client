import PikiLogo from '@/assets/images/piki-logo.svg';
import BottomTabBar from '@/components/bottom-tab-bar';
import { Header, HeaderIcon } from '@/components/header';

import AddWishHomeDialog from './_components/AddWishHomeDialog';
import CreateTournamentDialog from './_components/CreateTournamentDialog';
import InviteTournamentButton from './_components/InviteTournamentButton';
import MemberOnlyToast from './_components/MemberOnlyToast';
import TournamentList from './_components/tournament-list';

function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-gray-50 px-5 pt-padding-top pb-32">
      {/* 상단 헤더 */}
      <Header
        right={
          <>
            <HeaderIcon name="PROFILE" />
            <HeaderIcon name="ALARM" />
          </>
        }
      />
      {/* 메인 컨텐츠 */}
      <main className="mt-[54px] flex w-full flex-col gap-12">
        {/* 로고 + CTA 영역 */}
        <section className="flex flex-col items-center gap-12">
          {/* PIKI 로고 */}
          <PikiLogo aria-label="PIKI" />
          <h1 className="sr-only">PIKI</h1>

          {/* CTA 카드 + 초대 입장 */}
          <div className="flex w-full flex-col gap-3">
            {/* 위시 담기 / 토너먼트 만들기 2분할 */}
            <div className="flex w-full gap-3">
              <AddWishHomeDialog />
              <CreateTournamentDialog />
            </div>

            {/* 초대 토너먼트 입장 */}
            <InviteTournamentButton />
          </div>
        </section>

        {/* 진행 중인 토너먼트 */}
        <TournamentList />
      </main>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-[40px] left-1/2 z-20 -translate-x-1/2">
        <BottomTabBar />
      </div>

      <MemberOnlyToast />
    </div>
  );
}

export default HomePage;
