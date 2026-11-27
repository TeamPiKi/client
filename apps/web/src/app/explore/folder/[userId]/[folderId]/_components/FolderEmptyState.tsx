import Basket from '@/components/common/basket';

function FolderEmptyState() {
  return (
    <div role="status" className="flex flex-col items-center gap-4 px-5 pt-[178px]">
      <Basket type="panic" className="size-15" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="heading-1-semibold text-text-neutral-primary">볼 수 없는 폴더예요</p>
        <p className="body-1-medium text-text-neutral-tertiary">
          비공개로 바뀌었거나 삭제된 폴더예요
        </p>
      </div>
    </div>
  );
}

export default FolderEmptyState;
