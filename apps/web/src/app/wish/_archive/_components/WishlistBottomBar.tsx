import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';

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
  );
}

export default WishlistBottomBar;
