import AddIconFill from '@/assets/icons/fill/add.svg';
import Button from '@/components/button';

type WishlistFabAreaProps = {
  isDeleteMode: boolean;
  onAddItem: () => void;
};

function WishlistFabArea({ isDeleteMode, onAddItem }: WishlistFabAreaProps) {
  if (isDeleteMode) return null;

  return (
    <div className="pointer-events-none fixed right-0 bottom-[103px] left-0 z-30 mx-auto flex w-full max-w-120 justify-end pr-8">
      <Button
        variant="primary"
        size="xl"
        icon="only"
        onClick={onAddItem}
        aria-label="아이템 추가하기"
        className="pointer-events-auto"
      >
        <AddIconFill width={33.101} height={33.101} />
      </Button>
    </div>
  );
}

export default WishlistFabArea;
