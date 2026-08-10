import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import AccountInfoSection from './_components/AccountInfoSection';
import AppVersionFooter from './_components/AppVersionFooter';
import ProfileSection from './_components/ProfileSection';

function MypagePage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <main className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header left={<HeaderIcon name="BACK" />} center="마이" centerClassName="heading-1-bold" />
      <Spacing size={56} />

      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-32">
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
