import type { ItemStatusT, ItemT } from './item';

export type PostWishOCRResponseT = {
  wish: WishT;
  item: ItemT;
};

export type PostWishLinkResponseT = {
  wish: WishT;
  item: ItemT;
};

export type WishT = {
  id: number;
  createdAt: string;
};

export type WishItemT = {
  id: number;
  itemId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  status: ItemStatusT;
  sourcePlatform: string | null;
};
