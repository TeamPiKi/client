import type { UnderlineTabItemT } from '@/components/common/underline-tab';
import { ROUTES } from '@/consts/route';

import type { WishTabT } from '../_types/wishTab';

export const WISH_TAB = {
  ALL: 'all',
  FOLDER: 'folder',
} as const;

export const WISH_TAB_PANEL_ID = 'wish-tab-panel';

export const WISH_TABS: UnderlineTabItemT<WishTabT>[] = [
  { value: WISH_TAB.ALL, label: '전체 위시' },
  { value: WISH_TAB.FOLDER, label: '폴더' },
];

export const WISH_TAB_PATH: Record<WishTabT, string> = {
  [WISH_TAB.ALL]: ROUTES.WISHLIST,
  [WISH_TAB.FOLDER]: ROUTES.WISHLIST_FOLDER_TAB,
};
