import { Header, HeaderIcon } from '@/components/header';

import ExploreWishContent from './_components/ExploreWishContent';

type ExploreWishPageProps = {
  params: Promise<{ wishId: string }>;
};

async function ExploreWishPage({ params }: ExploreWishPageProps) {
  const { wishId } = await params;

  return (
    <main className="flex min-h-dvh flex-col bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top pb-[calc(var(--spacing-bottom-cta)+--spacing(9))]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">위시 정보</h1>}
      />

      <div className="mt-6">
        <ExploreWishContent wishId={Number(wishId)} />
      </div>
    </main>
  );
}

export default ExploreWishPage;
