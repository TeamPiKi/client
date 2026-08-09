import { ITEM_STATUS } from '@/consts/item';
import type { ItemTypeT } from '@/types/item';

import type { ItemInfoT, ReadyItemInfoT } from './itemInfoScreen.type';

/** READY 응답은 이미지를 항상 포함하므로, imageUrl 검사는 타입을 좁히기 위한 것이다 */
export const isReadyItemInfo = (item: ItemInfoT): item is ReadyItemInfoT =>
  item.status === ITEM_STATUS.READY && item.imageUrl !== null;

type ItemInfoScreenConfigT = {
  viewTitle: string;
  deleteConfirmTitle: string;
};

/** 위시·토너먼트 아이템이 화면을 공유하되 문구가 다르다 */
export const ITEM_INFO_SCREEN_CONFIG: Record<ItemTypeT, ItemInfoScreenConfigT> = {
  wish: {
    viewTitle: '위시 정보',
    deleteConfirmTitle: '위시를 삭제할까요?',
  },
  tournament: {
    viewTitle: '위시 정보 확인',
    deleteConfirmTitle: '상품을 삭제할까요?',
  },
};
