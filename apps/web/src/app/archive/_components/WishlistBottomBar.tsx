'use client';

import BottomTabBar from '@/components/bottom-tab-bar';
import { TOAST_OFFSET } from '@/components/toast/toast.const';
import { useToastOffset } from '@/components/toast/useToastOffset';

type WishlistBottomBarProps = {
  isDeleteMode: boolean;
  selectedCount: number;
};

function WishlistBottomBar({ isDeleteMode, selectedCount }: WishlistBottomBarProps) {
  // 삭제 모드("n개 선택됨" pill)에서 BottomTabBar가 언마운트돼도 토스트 offset 유지
  useToastOffset(TOAST_OFFSET.ABOVE_TAB_BAR);
  return (
    <div className="fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
      {isDeleteMode ? (
        <div className="flex h-[68px] w-[168px] items-center justify-center rounded-full bg-bg-layer-default shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)]">
          <span className="body-1-bold text-text-neutral-primary">{selectedCount}개 선택됨</span>
        </div>
      ) : (
        <BottomTabBar />
      )}
    </div>
  );
}

export default WishlistBottomBar;
