/**
 * 결과 화면 Suspense fallback.
 * ResultClient 의 로딩 상태와 동일한 문구·배경을 써서 경계 전환이 드러나지 않게 한다.
 */
function ResultLoadingFallback() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-layer-basement pt-padding-top">
      <p className="body-1-medium text-text-neutral-tertiary">결과를 불러오는 중...</p>
    </main>
  );
}

export default ResultLoadingFallback;
