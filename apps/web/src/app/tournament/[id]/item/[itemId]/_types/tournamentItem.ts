import type { ITEM_STATUS } from '@/consts/item';

export type GetTournamentItemResponseT = {
  tournamentItemId: number;
  itemId: number;
  /** 이미지로 등록한 경우 undefined */
  sourceUrl?: string;
  currency?: string;
  /** 개인 메모 - 위시에서 가져오기가 아니거나 비회원인 경우 undefined */
  memo?: string;
} & (
  | {
      status:
        | (typeof ITEM_STATUS)['PENDING']
        | (typeof ITEM_STATUS)['PROCESSING']
        | (typeof ITEM_STATUS)['FAILED'];
      name?: undefined;
      imageUrl?: undefined;
      price?: undefined;
    }
  | {
      status: (typeof ITEM_STATUS)['INCOMPLETE'];
      name?: string;
      imageUrl?: string;
      price?: number;
    }
  | {
      status: (typeof ITEM_STATUS)['READY'];
      name: string;
      imageUrl: string;
      price: number;
    }
);
