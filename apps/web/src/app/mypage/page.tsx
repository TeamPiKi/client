import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import BottomTabBar from '@/components/bottom-tab-bar';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import AccountInfoSection from './_components/AccountInfoSection';
import AppVersionFooter from './_components/AppVersionFooter';
import ProfileSection from './_components/ProfileSection';

async function MypagePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <div className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header left={<HeaderIcon name="BACK" />} center="설정" centerClassName="title-1" />
      <Spacing size={48} />

      <main className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-32">
        {/** 프로필 */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileSection />
        </HydrationBoundary>

        <Spacing size={32} />

        <AccountInfoSection />

        <Spacing size={24} />

        <AppVersionFooter />
      </main>

      {/* 하단 네비게이션 */}
      <BottomTabBar />
    </div>
  );
}

export default MypagePage;
