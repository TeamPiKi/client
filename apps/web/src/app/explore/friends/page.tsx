import { Suspense } from 'react';

import { Header, HeaderIcon } from '@/components/header';

import FriendWishContent from './_components/FriendWishContent';

function ExploreFriendsPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">친구가 담은 위시</h1>}
      />

      <Suspense>
        <FriendWishContent />
      </Suspense>
    </main>
  );
}

export default ExploreFriendsPage;
