import TrashIconFill from '@/assets/icons/fill/trash.svg';
import Spinner from '@/components/spinner';

import WishFab from './WishFab';

type WishlistFabAreaProps = {
  isDeleteMode: boolean;
  isDeleteWishesPending: boolean;
  isDeleteDisabled: boolean;
  onAddItem: () => void;
  onEnterDeleteMode: () => void;
  onConfirmDelete: () => void;
};

function WishlistFabArea({
  isDeleteMode,
  isDeleteWishesPending,
  isDeleteDisabled,
  onAddItem,
  onEnterDeleteMode,
  onConfirmDelete,
}: WishlistFabAreaProps) {
  return (
    <div className="pointer-events-none fixed right-0 bottom-10 left-0 z-30 mx-auto flex w-full max-w-120 justify-end px-[21px]">
      <div className="pointer-events-auto">
        {isDeleteMode ? (
          <button
            type="button"
            onClick={onConfirmDelete}
            aria-label="선택한 위시 삭제하기"
            disabled={isDeleteDisabled || isDeleteWishesPending}
            className="flex size-[62px] cursor-pointer items-center justify-center rounded-full border border-border-neutral-muted bg-bg-layer-default shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] disabled:opacity-50"
          >
            {isDeleteWishesPending ? (
              <Spinner size={20} />
            ) : (
              <TrashIconFill width={33} height={33} className="text-icon-neutral-primary" />
            )}
          </button>
        ) : (
          <WishFab onAddItem={onAddItem} onDelete={onEnterDeleteMode} />
        )}
      </div>
    </div>
  );
}

export default WishlistFabArea;
