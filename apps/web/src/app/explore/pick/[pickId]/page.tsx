import { Header, HeaderIcon } from '@/components/header';

import ExplorePickContent from './_components/ExplorePickContent';

type ExplorePickPageProps = {
  params: Promise<{ pickId: string }>;
};

async function ExplorePickPage({ params }: ExplorePickPageProps) {
  const { pickId } = await params;

  return (
    <main className="flex min-h-dvh flex-col bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top pb-[calc(var(--spacing-bottom-cta)+--spacing(9))]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">위시 정보</h1>}
      />

      <div className="mt-6">
        <ExplorePickContent pickId={Number(pickId)} />
      </div>
    </main>
  );
}

export default ExplorePickPage;
