import type { ITEM_STATUS } from '@/consts/item';

export type ItemTypeT = 'wish' | 'tournament';

export type ItemT = {
  /** 상품 정보가 정해지기 전에는 null */
  id: number | null;
  status: ItemStatusT;
  name: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourcePlatform: string | null;
  method: ItemExtractMethodT | null;
  userInput: boolean;
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

export type ItemExtractMethodT =
  /** 상품 페이지의 구조화된 데이터에서 추출한 값 */
  | 'STRUCTURED'
  /** LLM 을 사용해 추출한 값 */
  | 'LLM';

export type PriceHistoryT = {
  price: number;
  extractedAt: string;
  method: ItemExtractMethodT | null;
  userInput: boolean;
  /**
   * - true: 가격 수동 갱신 주최가 본인인 경우 (userInput이 true인 경우)
   * - false: 가격 수동 갱신 주최가 본인이 아닌 경우 (userInput이 true인 경우)
   * - null: userInput이 false인 경우
   */
  editedByMe: boolean | null;
};
