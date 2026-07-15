import type { ItemStatusT, ItemT } from '@/types/item';
import type { WishT } from '@/types/wish';

export type WishlistEntryT = {
  wish: WishT;
  item: ItemT;
};

export type WishItemT = {
  id: number;
  itemId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  status: ItemStatusT;
};
