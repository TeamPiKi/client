import Spacing from '@/components/spacing';

import WishGrid from '../_common/_components/WishGrid';
import { MOCK_WISHES } from '../_common/_consts/wishMock';

const MAX_DISPLAY_COUNT = 999;

function AllWishTabContent() {
  const wishCount = MOCK_WISHES.length;

  return (
    <>
      <div className="flex items-center justify-between px-5">
        <p className="body-2-medium text-text-neutral-tertiary">
          상품 {wishCount > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : wishCount}
        </p>
        <button type="button" className="cursor-pointer body-2-medium text-text-neutral-secondary">
          편집 {/* TODO: 위시 편집 동작 연결 */}
        </button>
      </div>
      <Spacing size={16} />
      {/* TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: all) 추가 */}
      <WishGrid wishes={MOCK_WISHES} />
    </>
  );
}

export default AllWishTabContent;
