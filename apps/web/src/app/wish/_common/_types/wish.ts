import type { ItemT } from '@/types/item';
import type { GetWishlistResponseT } from '@/types/wish';

// TODO: API 연동 시 GetWishlistResponseT 로 교체 — discountRate 는 아직 API 에 없음
export type WishListItemT = Omit<GetWishlistResponseT, 'item'> & {
  item: ItemT & {
    /** 할인율(%) — 할인이 없으면 null */
    discountRate: number | null;
  };
};

// TEMP: API 연동 시 응답 타입으로 교체
export type WishFolderT = {
  id: number;
  name: string;
  wishIds: number[];
};
