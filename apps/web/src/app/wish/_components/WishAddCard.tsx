import { AddIconOutline } from '@/assets/icons';

/** TODO: 위시 담기 동작 연결 */
function WishAddCard() {
  return (
    <button type="button" className="flex w-full cursor-pointer flex-col text-left">
      <span className="flex aspect-[133/140] w-full items-center justify-center bg-gray-75">
        <AddIconOutline className="size-6 text-icon-neutral-secondary" />
      </span>
      <span className="flex flex-col gap-1 p-3">
        <span className="caption-1-semibold text-text-neutral-primary">상품 추가하기</span>
        <span className="caption-1-regular text-text-neutral-secondary">위시를 추가해보세요.</span>
      </span>
    </button>
  );
}

export default WishAddCard;
