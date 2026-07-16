import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { ItemT } from '@/types/item';
import type { WishItemT, WishT } from '@/types/wish';

type WishlistEntryT = {
  wish: WishT;
  item: ItemT;
};

type WishlistApiResponseT = ApiResponseT<WishlistEntryT[]> & {
  pageResponse: {
    nextCursor: string | null;
    hasNext: boolean;
  };
};

export type WishlistPageT = {
  items: WishItemT[];
  nextCursor: string | null;
  hasNext: boolean;
};

const mapWishlist = (entries: WishlistEntryT[]): WishItemT[] =>
  entries.map(({ wish, item }) => ({
    id: wish.id,
    itemId: item.id,
    status: item.status,
    name: item.name ?? '',
    price: item.currentPrice ?? 0,
    imageUrl: item.imageUrl ?? null,
  }));

export const getWishlist = async (cursor: string | null = null): Promise<WishlistPageT> => {
  const params = { size: 20, ...(cursor ? { cursor } : {}) };

  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<WishlistApiResponseT>(ENDPOINTS.WISHLISTS, { params });
    return {
      items: mapWishlist(data.data),
      nextCursor: data.pageResponse.nextCursor,
      hasNext: data.pageResponse.hasNext,
    };
  }

  const { data } = await clientApi.get<WishlistApiResponseT>(ENDPOINTS.WISHLISTS, { params });
  return {
    items: mapWishlist(data.data),
    nextCursor: data.pageResponse.nextCursor,
    hasNext: data.pageResponse.hasNext,
  };
};
