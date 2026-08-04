import type { ITEM_STATUS } from '@/consts/item';
import type { WishT } from '@/types/wish';

export type GetWishResponseT = {
  wish: WishT;
  item: { id: number } & (
    | {
        status: (typeof ITEM_STATUS)['PROCESSING'] | (typeof ITEM_STATUS)['FAILED'];
        name: null;
        imageUrl: null;
        price: null;
        currency: null;
        sourceUrl: string | null; // 확인필
      }
    | {
        status: (typeof ITEM_STATUS)['READY'] | (typeof ITEM_STATUS)['PENDING'];
        name: string;
        imageUrl: string;
        price: number;
        currency: string;
        sourceUrl: string | null;
      }
  );
  /**
   * 갱신 필요 여부
   * - 이미지로 등록한 경우: null
   * - 링크로 등록한 경우: boolean
   */
  refreshNeeded: boolean | null;
  /**
   * 재사용 여부
   * - 이미지로 등록한 경우: null
   * - 링크로 등록한 경우: boolean
   */
  reused: boolean | null;
};

export type PatchWishResponseT = GetWishResponseT;
