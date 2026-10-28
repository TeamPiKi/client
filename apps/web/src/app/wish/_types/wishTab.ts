import type { WishListItemT } from '@/types/wish';

import type { WishFolderT } from '../_common/_types/wish';
import type { WISH_TAB } from '../_consts/wishTab';

export type WishTabT = (typeof WISH_TAB)[keyof typeof WISH_TAB];

export type AllWishTabContentProps = {
  wishes: WishListItemT[];
  selectedWishIds?: Set<number>;
  onToggleSelect?: (wishId: number) => void;
};

export type FolderTabContentProps = {
  folders: WishFolderT[];
  onCreate: (name: string) => void;
  onRename: (folderId: number, name: string) => void;
  onDelete: (folderId: number) => void;
};
