import { Header, HeaderIcon } from '@/components/header';

type ExploreDetailFrameProps = {
  children: React.ReactNode;
};

/** 탐색 위시 상세·1위 상세의 화면 틀 — 로딩 화면과 실제 화면이 같이 써 진입 전후 레이아웃이 어긋나지 않게 함 */
function ExploreDetailFrame({ children }: ExploreDetailFrameProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top pb-[calc(var(--spacing-bottom-cta)+--spacing(9))]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">위시 정보</h1>}
      />

      <div className="mt-6">{children}</div>
    </main>
  );
}

export default ExploreDetailFrame;
