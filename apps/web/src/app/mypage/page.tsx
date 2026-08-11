import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import Spacing from '@/components/spacing';
import { getIsGuest } from '@/utils/getIsGuest';
import { getQueryClient } from '@/utils/queryClient';

import AccountInfoSection from './_components/AccountInfoSection';
import AppVersionFooter from './_components/AppVersionFooter';
import MypageGuestBanner from './_components/MypageGuestBanner';
import ProfileSection from './_components/ProfileSection';

async function MypagePage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  const isGuest = await getIsGuest();

  return (
    <main className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <h1 className="heading-1-bold text-text-neutral-primary">내 정보</h1>
      <Spacing size={isGuest ? 20 : 24} />

      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-32">
        {isGuest && (
          <>
            <MypageGuestBanner />
            <Spacing size={20} />
          </>
        )}

        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileSection />
        </HydrationBoundary>

        <Spacing size={32} />

        <AccountInfoSection />

        <Spacing size={24} />

        <AppVersionFooter />
      </div>
    </main>
  );
}

export default MypagePage;
