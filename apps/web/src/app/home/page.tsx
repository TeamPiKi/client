import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import AddWishHomeDialog from './_components/AddWishHomeDialog';
import CreateTournamentDialog from './_components/CreateTournamentDialog';
import InviteTournamentDialog from './_components/InviteTournamentDialog';
import MemberOnlyToast from './_components/MemberOnlyToast';
import HomeOnboarding from './_components/home-onboarding';
import TournamentList from './_components/tournament-list';

async function HomePage() {
  const queryClient = getQueryClient();

  /** 위시 담기 게스트 분기를 위해 유저 정보 프리페치 (AddWishHomeDialog가 useGetMe로 소비) */
  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="to-bg-base-50 relative flex min-h-dvh flex-col bg-linear-to-b from-bg-layer-default px-5 pt-padding-top pb-32">
        {/* 상단 헤더 */}
        <Header left={<PiKiLogo />} right={<HeaderIcon name="ALARM" />} />

        <Spacing size={24} />

        {/* 메인 컨텐츠 */}
        <main className="flex w-full flex-1 flex-col gap-8">
          {/** 위시 추가·토너먼트 생성·토너먼트 초대 */}
          <section className="grid grid-cols-2 gap-3 py-2.5">
            <AddWishHomeDialog />
            <CreateTournamentDialog />
            <InviteTournamentDialog />
          </section>

          {/* 최근 생성한 토너먼트 */}
          <TournamentList />
        </main>

        <MemberOnlyToast />
        <HomeOnboarding />
      </div>
    </HydrationBoundary>
  );
}

export default HomePage;
