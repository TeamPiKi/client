import type { ITEM_STATUS } from '@/consts/item';
import type { ItemExtractMethodT, PatchItemRequestT, PriceHistoryT } from '@/types/item';
import type { WishT } from '@/types/wish';

type ItemT = {
  /** 이미지로 등록한 항목은 원본 URL 이 없어 null */
  sourceUrl: string | null;
  sourcePlatform: string | null;
  method: ItemExtractMethodT | null;
  userInput: boolean;
  refreshing: boolean;
} & (
  | {
      id: null;
      status: (typeof ITEM_STATUS)['PARSING'] | (typeof ITEM_STATUS)['FAILED'];
      name: null;
      imageUrl: null;
      price: null;
      currency: null;
    }
  | {
      id: number;
      status: (typeof ITEM_STATUS)['INCOMPLETE'];
      name: string | null;
      imageUrl: string | null;
      price: number | null;
      currency: string | null;
    }
  | {
      id: number;
      status: (typeof ITEM_STATUS)['READY'];
      name: string;
      imageUrl: string;
      price: number;
      currency: string | null;
    }
);

export type PatchWishRequestT = PatchItemRequestT & {
  memo?: string;
};

export type GetWishResponseT = {
  wish: WishT;
  /** 개인 메모 — 본인만 볼 수 있음 */
  memo: string | null;
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
};
