import { AddIconOutline } from '@/assets/icons';

type FolderAddCardProps = {
  onClick: () => void;
};

function FolderAddCard({ onClick }: FolderAddCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col text-left"
    >
      <span className="flex aspect-[201/248] w-full items-center justify-center bg-gray-75">
        <AddIconOutline className="size-8 text-icon-neutral-secondary" />
      </span>
      <span className="flex flex-col gap-1 p-3">
        <span className="body-2-medium text-text-neutral-primary">폴더 추가하기</span>
        <span className="caption-1-regular text-text-neutral-secondary">
          위시를 모아 관리하세요.
        </span>
      </span>
    </button>
  );
}

export default FolderAddCard;
