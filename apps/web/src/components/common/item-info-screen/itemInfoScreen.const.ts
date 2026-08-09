import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT, ItemTypeT } from '@/types/item';

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

/** READY 응답은 이미지를 항상 포함하므로, imageUrl 검사는 타입을 좁히기 위한 것이다 */
export const isReadyItemInfo = (item: ItemInfoT): item is ReadyItemInfoT =>
  item.status === ITEM_STATUS.READY && item.imageUrl !== null;

/** 가격 정보 새로고침. 링크로 담은 상품에서만 쓸 수 있어 한 묶음으로 받는다 */
export type PriceRefreshT = {
  refresh: () => void;
  isPending: boolean;
  isFailed: boolean;
  closeFailedDialog: () => void;
};

type ItemInfoScreenConfigT = {
  viewTitle: string;
  deleteConfirmTitle: string;
  /** 메모는 위시에서만 지원한다 */
  hasMemo: boolean;
};

/** 위시·토너먼트 아이템이 화면을 공유하되 문구와 메모 지원 여부가 다르다 */
export const ITEM_INFO_SCREEN_CONFIG: Record<ItemTypeT, ItemInfoScreenConfigT> = {
  wish: {
    viewTitle: '위시 정보',
    deleteConfirmTitle: '위시를 삭제할까요?',
    hasMemo: true,
  },
  tournament: {
    viewTitle: '위시 정보 확인',
    deleteConfirmTitle: '상품을 삭제할까요?',
    hasMemo: false,
  },
};
