import type { ITEM_STATUS } from '@/consts/item';
import type { PatchItemRequestT, PriceHistorySourceT, PriceHistoryT } from '@/types/item';
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
      /** 추출이 일부만 채운 상태 — 채운 필드만 값이 있다 */
      status: (typeof ITEM_STATUS)['INCOMPLETE'];
      name: string | null;
      imageUrl: string | null;
      price: number | null;
      currency: string | null;
    }
  | {
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
  refreshNeeded: null;
  reused: null;
};
