import type { ITEM_STATUS } from '@/consts/item';

export type GetTournamentItemResponseT = {
  tournamentItemId: number;
  itemId: number;
  /** 이미지로 등록한 경우 undefined */
  sourceUrl?: string;
  currency?: string;
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
      status: (typeof ITEM_STATUS)['READY'];
      name: string;
      imageUrl: string;
      price: number;
    }
);
