import type { ReactNode } from 'react';

/** READY 가 아닌 상태 카드의 공통 프레임 — READY 카드와 같은 크기의 회색 영역 가운데에 안내를 띄운다 */
function WishStatusFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col bg-black/5">
      <div className="aspect-[201/166] w-full" />
      <div className="h-[124px]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        {children}
      </div>
    </div>
  );
}

export default WishStatusFrame;
