import BottomTabBar from '@/components/bottom-tab-bar';
import { Z_INDEX } from '@/consts/zIndex';

type WishlistBottomBarProps = {
  isDeleteMode: boolean;
  selectedCount: number;
};

function WishlistBottomBar({ isDeleteMode, selectedCount }: WishlistBottomBarProps) {
  return (
    <div
      // 삭제 모드(BottomTabBar 언마운트)에서도 토스트가 하단 바 위에 뜨도록 마커 유지 (globals.css 참고)
      data-bottom-tab-bar
      className="fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3"
      style={{ zIndex: Z_INDEX.BOTTOM_TAB_BAR }}
    >
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
