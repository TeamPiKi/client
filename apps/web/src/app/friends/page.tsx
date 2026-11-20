import { Header, HeaderIcon } from '@/components/header';

import FriendsContent from './_components/FriendsContent';

function FriendsPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pt-padding-top">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">내 친구 목록</h1>}
      />

      <FriendsContent />
    </main>
  );
}

export default FriendsPage;
