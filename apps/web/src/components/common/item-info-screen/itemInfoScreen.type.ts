import type { ItemStatusT } from '@/types/item';

/** 화면을 그리는 데 필요한 상품 정보. 아직 정보를 못 가져온 상태를 위해 빈 값을 허용한다 */
export type ItemInfoT = {
  status: ItemStatusT;
  imageUrl: string | null;
  name: string;
  price: number;
  /** 링크로 담은 경우에만 존재 — 이미지 위 원본 링크 칩 */
  sourceUrl: string | null;
};

/** 조회 화면을 그릴 수 있는 상품 — 이미지가 보장된다 */
export type ReadyItemInfoT = ItemInfoT & { imageUrl: string };

/** 가격 정보 새로고침. 링크로 담은 상품에서만 쓸 수 있어 한 묶음으로 받는다 */
export type PriceRefreshT = {
  refresh: () => void;
  isPending: boolean;
  isFailed: boolean;
  closeFailedDialog: () => void;
};

/** 개인 메모. 위시에서만 지원해 한 묶음으로 받는다 */
export type MemoT = {
  value: string;
  /** 빈 문자열이면 메모 삭제 */
  save: (memo: string) => void;
};
