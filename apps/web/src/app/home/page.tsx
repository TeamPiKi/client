import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { getTournamentList } from '@/apis/getTournamentList';
import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { getIsGuest } from '@/utils/getIsGuest';
import { getQueryClient } from '@/utils/queryClient';

import AddWishHomeDialog from './_components/AddWishHomeDialog';
import CreateTournamentDialog from './_components/CreateTournamentDialog';
import HomeGuestBannerClient from './_components/HomeGuestBannerClient';
import InviteTournamentDialog from './_components/InviteTournamentDialog';
import HomeOnboarding from './_components/home-onboarding';
import TournamentList from './_components/tournament-list';

async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS({ limit: 3 }),
    queryFn: () => getTournamentList({ limit: 3 }),
  });

  const isGuest = await getIsGuest();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="to-bg-gray-50 relative flex min-h-dvh flex-col bg-linear-to-b from-bg-layer-default px-5 pt-padding-top pb-32">
        {/* 상단 헤더 */}
        <Header left={<PiKiLogo />} right={<HeaderIcon name="ALARM" />} />

        <Spacing size={isGuest ? 12 : 24} />

        {/* 메인 컨텐츠 */}
        <main className="flex w-full flex-1 flex-col gap-8">
          {/**
           * 배너 + 그리드 영역.
           * Figma 스펙: flex-direction: column; gap: 12px (배너↔그리드 사이).
           * 배너 자체는 padding: 16.4px 61.5px 12.23px 0 을 가짐.
           */}
          <div className="flex flex-col gap-3">
            {isGuest && <HomeGuestBannerClient />}
            <section className="grid grid-cols-2 gap-3">
              <AddWishHomeDialog />
              <CreateTournamentDialog />
              <InviteTournamentDialog />
            </section>
          </div>

          {/* 최근 생성한 토너먼트 */}
          <TournamentList isGuest={isGuest} />
        </main>

        <HomeOnboarding />
      </div>
    </HydrationBoundary>
  );
}

export default HomePage;
