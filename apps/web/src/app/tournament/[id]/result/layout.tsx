import { Suspense } from 'react';

import ResultLoadingFallback from './_components/ResultLoadingFallback';

/**
 * Suspense 경계 전용 layout.
 *
 * 이 경계가 없으면 결과 페이지의 RSC fetch 가 끝날 때까지 내비게이션이 커밋되지 않아
 * 결승 직후 매치 화면에 머물며 대진 스켈레톤이 뜬다.
 *
 * loading.tsx 는 같은 레벨의 layout 을 감싸지 않으므로(`<Layout><Suspense>{page}</Suspense></Layout>`),
 * 데이터를 기다리는 가드는 이 아래(page 의 async 자식)에 있어야 fallback 이 걸린다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ResultLoadingFallback />}>{children}</Suspense>;
}
