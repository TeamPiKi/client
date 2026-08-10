import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import EditForm from './_components/EditForm';

function MypageEditPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <div className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center="프로필 수정"
        centerClassName="heading-1-bold text-text-neutral-primary"
      />

      <Spacing size={60} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditForm />
      </HydrationBoundary>
    </div>
  );
}

export default MypageEditPage;
