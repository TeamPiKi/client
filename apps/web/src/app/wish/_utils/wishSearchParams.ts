import { WISH_TAB } from '../_consts/wishTab';
import type { WishTabT } from '../_types/wishTab';

export const parseWishTabParam = (tab?: string | null): WishTabT =>
  tab === WISH_TAB.FOLDER ? WISH_TAB.FOLDER : WISH_TAB.ALL;
