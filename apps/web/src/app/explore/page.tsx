import { Header } from '@/components/header';

import ExploreProfileLink from './_components/ExploreProfileLink';

function ExplorePage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-32">
      <Header
        className="px-5"
        left={<h1 className="heading-1-bold text-text-neutral-primary">탐색</h1>}
        right={<ExploreProfileLink />}
      />
    </main>
  );
}

export default ExplorePage;
