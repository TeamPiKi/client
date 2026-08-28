import type { ITEM_STATUS } from '@/consts/item';

export type ItemTypeT = 'wish' | 'tournament';

export type ItemT = {
  id: number;
  status: ItemStatusT;
  name: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourcePlatform: string | null;
};

export type ItemStatusT<K extends keyof typeof ITEM_STATUS = keyof typeof ITEM_STATUS> =
  (typeof ITEM_STATUS)[K];

export type PatchItemRequestT = {
  name?: string;
  price?: number;
  image?: File;
  /** NOTE: currency는 optional이지만, 사용하지 않는 필드이므로 삭제함. 추후 필요할 때 다시 추가할 수 있음 */
  // currency?: string;
};

export type PriceHistorySourceT =
  /** 서버에서 추출한 가격 */
  | 'SERVER'
  /** 서버에서 LLM 사용하여 추출한 가격 */
  | 'SERVER_LLM'
  /** 사용자가 수동으로 입력한 가격 */
  | 'MANUAL'
  /** price history가 없는 경우 (도입 전) */
  | null;

export type PriceHistoryT = {
  price: number;
  extractedAt: string;
  source: PriceHistorySourceT;
  /**
   * - true: 가격 수동 갱신 주최가 본인인 경우 (source가 MANUAL인 경우)
   * - false: 가격 수동 갱신 주최가 본인이 아닌 경우 (source가 MANUAL인 경우)
   * - null: source가 MANUAL이 아닌 경우
   */
  editedByMe: boolean | null;
};
