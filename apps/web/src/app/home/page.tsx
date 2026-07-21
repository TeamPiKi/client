import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { BasketIconFill } from '@/assets/icons';
import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import BottomTabBar from '@/components/bottom-tab-bar';
import CreateTournamentDialogContent from '@/components/common/create-tournament-dialog';
import { Dialog, DialogTrigger } from '@/components/dialog';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import AddWishHomeDialog from './_components/AddWishHomeDialog';
import InviteTournamentDialog from './_components/InviteTournamentDialog';
import MemberOnlyToast from './_components/MemberOnlyToast';
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
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="새 토너먼트 만들기"
                  className="flex h-[104px] cursor-pointer flex-col rounded-2xl bg-gray-900 p-4"
                >
                  <span className="text-left body-1-semibold whitespace-pre-line text-base-50">
                    {'새 토너먼트\n만들기'}
                  </span>
                  <BasketIconFill className="size-7.5 self-end text-white" />
                </button>
              </DialogTrigger>
              <CreateTournamentDialogContent />
            </Dialog>
            <InviteTournamentDialog />
          </section>

          {/* 최근 생성한 토너먼트 */}
          <TournamentList />
        </main>

        {/* 하단 네비게이션 */}
        <BottomTabBar />

        <MemberOnlyToast />
      </div>
    </HydrationBoundary>
  );
}

export default HomePage;
