import { Z_INDEX } from '@/consts/zIndex';

import WishSearchLink from './_common/_components/WishSearchLink';
import WishTabBar from './_components/WishTabBar';
import WishTabContent from './_components/WishTabContent';
import WishTabSummary from './_components/WishTabSummary';

function WishPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-46">
      <div
        className="sticky top-0 flex flex-col gap-6 bg-bg-layer-basement px-5 pt-padding-top pb-4"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <div className="flex items-center justify-between">
          <h1 className="heading-1-bold text-text-neutral-primary">내 위시리스트</h1>
          <WishSearchLink />
        </div>
        <WishTabBar />
        <WishTabSummary />
      </div>
      <WishTabContent />
    </main>
  );
}

export default WishPage;
