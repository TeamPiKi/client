'use client';

import { useSearchParams } from 'next/navigation';

import { MOCK_FOLDERS, MOCK_WISHES } from '../_common/_consts/wishMock';
import { WISH_TAB } from '../_consts/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';

const MAX_DISPLAY_COUNT = 999;

function WishTabSummary() {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  const wishCount = MOCK_WISHES.length;

  return (
    <div className="flex items-center justify-between">
      <p className="body-2-medium text-text-neutral-tertiary">
        {isFolderTab
          ? `폴더 ${MOCK_FOLDERS.length}개`
          : `상품 ${wishCount > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : wishCount}`}
      </p>
      <button type="button" className="cursor-pointer body-2-medium text-text-neutral-secondary">
        편집 {/* TODO: 위시·폴더 편집 동작 연결 */}
      </button>
    </div>
  );
}

export default WishTabSummary;
