import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Z_INDEX } from '@/consts/zIndex';

type WishlistBottomBarProps = {
  isDeleteMode: boolean;
  selectedCount: number;
  onOpenDeleteDialog: () => void;
};

function WishlistBottomBar({
  isDeleteMode,
  selectedCount,
  onOpenDeleteDialog,
}: WishlistBottomBarProps) {
  if (!isDeleteMode) return null;

  return (
    /** NOTE: 삭제 모드에서 삭제 CTA 가 탭바를 덮으므로, 토스트가 이 바 위에 뜨도록 마커 유지 (globals.css 참고) */
    <div data-bottom-tab-bar style={{ zIndex: Z_INDEX.BOTTOM_CTA }}>
      <BottomCta hasGradient>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={selectedCount === 0}
          onClick={onOpenDeleteDialog}
        >
          선택한 {selectedCount}개의 상품 삭제
        </Button>
      </BottomCta>
    </div>
  );
}

export default WishlistBottomBar;
