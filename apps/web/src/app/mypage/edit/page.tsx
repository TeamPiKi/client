import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import EditForm from './_components/EditForm';

function MypageEditPage() {
  const queryClient = getQueryClient();
  // await 하지 않음 — pending dehydrate 스트리밍. 재방문 시 클라 캐시로 즉시 렌더
  void queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <div className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center="내 프로필 수정"
        centerClassName="title-1 text-text-neutral-primary"
      />

      <Spacing size={60} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditForm />
      </HydrationBoundary>
    </div>
  );
}

export default MypageEditPage;
