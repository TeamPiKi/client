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
  name?: string;
  price?: number;
  image?: File;
  /** NOTE: currency는 optional이지만, 사용하지 않는 필드이므로 삭제함. 추후 필요할 때 다시 추가할 수 있음 */
  // currency?: string;
};
