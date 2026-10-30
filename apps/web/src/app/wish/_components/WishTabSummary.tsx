'use client';

import { useSearchParams } from 'next/navigation';

import { SearchIconOutline } from '@/assets/icons';

import { WISH_MODE } from '../_common/_consts/wishMode';
import type { WishModeT } from '../_common/_types/wishMode';
import { WISH_TAB } from '../_consts/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';

const MAX_DISPLAY_COUNT = 999;

type WishTabSummaryProps = {
  wishCount: number;
  hasMoreWishes: boolean;
  folderCount: number;
  mode: WishModeT;
  onEdit: () => void;
  onSearch: () => void;
};

const formatWishCount = (count: number, hasMore: boolean) => {
  if (count > MAX_DISPLAY_COUNT) return `${MAX_DISPLAY_COUNT}+`;
  return hasMore ? `${count}+` : String(count);
};

function WishTabSummary({
  wishCount,
  hasMoreWishes,
  folderCount,
  mode,
  onEdit,
  onSearch,
}: WishTabSummaryProps) {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  if (isFolderTab && folderCount === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="body-2-medium text-text-neutral-tertiary">
        {isFolderTab
          ? `폴더 ${folderCount}개`
          : `상품 ${formatWishCount(wishCount, hasMoreWishes)}`}
      </p>
      {!isFolderTab && mode === WISH_MODE.DEFAULT && (
        <div className="flex items-center gap-3 body-2-medium text-text-neutral-secondary">
          <button
            type="button"
            onClick={onSearch}
            className="flex cursor-pointer items-center gap-0.5"
          >
            <SearchIconOutline className="size-[18px] p-[1.8px] text-icon-neutral-primary" />
            검색
          </button>
          <span aria-hidden className="h-3.5 w-[1.4px] bg-gray-300" />
          <button type="button" onClick={onEdit} className="cursor-pointer">
            편집
          </button>
        </div>
      )}
    </div>
  );
}

export default WishTabSummary;
