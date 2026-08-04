import type { ITEM_STATUS } from '@/consts/item';
import type { PriceHistorySourceT, PriceHistoryT } from '@/types/item';
import type { WishT } from '@/types/wish';

type ItemT = {
  id: number;
  source: PriceHistorySourceT | null;
  /** 이미지로 등록한 항목은 원본 URL 이 없어 null */
  sourceUrl: string | null;
  sourcePlatform: string | null;
} & (
  | {
      status:
        | (typeof ITEM_STATUS)['PENDING']
        | (typeof ITEM_STATUS)['PROCESSING']
        | (typeof ITEM_STATUS)['FAILED'];
      name: null;
      imageUrl: null;
      price: null;
      currency: null;
    }
  | {
      status: (typeof ITEM_STATUS)['READY'];
      name: string;
      imageUrl: string;
      price: number;
      currency: string | null;
    }
);

export type GetWishResponseT = {
  wish: WishT;
  item: ItemT;
  /**
   * 가격 갱신 기록
   * - 최신순 정렬
   * - 최대 50건
   */
  priceHistory: PriceHistoryT[];
};

export type PatchWishResponseT = {
  wish: WishT;
  item: ItemT;
  refreshNeeded: null;
  reused: null;
};
