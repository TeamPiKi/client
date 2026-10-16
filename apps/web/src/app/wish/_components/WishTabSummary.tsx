'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { ROUTES } from '@/consts/route';

import { MOCK_FOLDERS } from '../_common/_consts/wishMock';
import { WISH_MODE } from '../_common/_consts/wishMode';
import type { WishModeT } from '../_common/_types/wishMode';
import { WISH_TAB } from '../_consts/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';

const MAX_DISPLAY_COUNT = 999;

type WishTabSummaryProps = {
  wishCount: number;
  mode: WishModeT;
  onEdit: () => void;
};

function WishTabSummary({ wishCount, mode, onEdit }: WishTabSummaryProps) {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  const editClassName = 'cursor-pointer body-2-medium text-text-neutral-secondary';

  return (
    <div className="flex items-center justify-between">
      <p className="body-2-medium text-text-neutral-tertiary">
        {isFolderTab
          ? `폴더 ${MOCK_FOLDERS.length}개`
          : `상품 ${wishCount > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : wishCount}`}
      </p>
      {isFolderTab && (
        <Link href={ROUTES.WISHLIST_FOLDER_EDIT} className={editClassName}>
          편집
        </Link>
      )}
      {!isFolderTab && mode === WISH_MODE.DEFAULT && (
        <button type="button" onClick={onEdit} className={editClassName}>
          편집
        </button>
      )}
    </div>
  );
}

export default WishTabSummary;
