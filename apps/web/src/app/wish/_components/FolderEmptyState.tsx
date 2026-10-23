import BasketGuestIcon from '@/assets/images/basket-guest.svg';
import Button from '@/components/button';

type FolderEmptyStateProps = {
  onAdd: () => void;
};

function FolderEmptyState({ onAdd }: FolderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 pt-[75px]" role="status">
      <BasketGuestIcon width={60} height={60} aria-hidden />
      <p className="flex flex-col items-center gap-1 text-center body-1-medium text-text-neutral-secondary">
        아직 생성한 폴더가 없어요.
        <span className="body-1-semibold text-bg-neutral-secondary">
          폴더를 생성하고 위시를 관리해보세요.
        </span>
      </p>
      <Button variant="secondary" size="sm" onClick={onAdd}>
        폴더 추가하기
      </Button>
    </div>
  );
}

export default FolderEmptyState;
