import type { ITEM_STATUS } from '@/consts/item';

export type ItemTypeT = 'wish' | 'tournament';

export type ItemT = {
  id: number;
  status: ItemStatusT;
  name: string;
  price: number;
  currency: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourcePlatform: string | null;
};

export type ItemStatusT = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export type PatchItemRequestT = {
  name: string;
  image: File;
  currency: string;
  price: number;
};
