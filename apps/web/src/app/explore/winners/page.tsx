import { Suspense } from 'react';

import { Header, HeaderIcon } from '@/components/header';

import WinnerIllustration from './_components/WinnerIllustration';
import WinnerWishGrid from './_components/WinnerWishGrid';

function ExploreWinnersPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">남들은 뭘 골랐을까?</h1>}
      />

      <div className="mt-4 mb-6 flex items-end justify-between px-5">
        <div className="flex flex-col gap-0.5 text-gray-800">
          <p className="body-2-regular">고민 끝에 살아남은 위시!</p>
          <p className="body-1-semibold">토너먼트 1위 위시를 구경해 보세요</p>
        </div>
        <WinnerIllustration />
      </div>

      <Suspense>
        <WinnerWishGrid />
      </Suspense>
    </main>
  );
}

export default ExploreWinnersPage;
