import type { ITEM_STATUS } from '@/consts/item';

export type ItemTypeT = 'wish' | 'tournament';

export type ItemT = {
  id: number;
  status: ItemStatusT;
  name: string;
  currentPrice: number;
  currency: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourcePlatform: string | null;
};

export type ItemStatusT = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];
