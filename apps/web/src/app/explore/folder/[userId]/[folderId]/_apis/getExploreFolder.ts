import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { getApiErrorStatus } from '@/utils/apiError';

import type { ExploreFolderT } from '../../../../_common/_types/explore';
import type { GetExploreFolderResponseT } from '../_types/exploreFolder';

/** 비공개 폴더·비공개 프로필·차단 관계·삭제된 폴더는 서버가 모두 404 로 내려줘 볼 수 없는 폴더(null)로 처리 */
export const getExploreFolder = async (
  userId: string,
  folderId: number
): Promise<ExploreFolderT | null> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;

  try {
    const { data } = await api.get<ApiResponseT<GetExploreFolderResponseT>>(
      ENDPOINTS.PROFILE_FOLDER(userId, folderId)
    );
    const { name, wishes } = data.data;

    return {
      folderId,
      name,
      wishes: wishes.map(({ wishId, saved, savedWishId, item }) => ({
        wishId,
        item: {
          name: item.name ?? '',
          price: item.price,
          discountRate: item.discountRate,
          imageUrl: item.imageUrl,
          sourcePlatform: item.sourcePlatform,
        },
        isInMyWish: saved,
        savedWishId,
      })),
    };
  } catch (error) {
    if (getApiErrorStatus(error) === 404) return null;
    throw error;
  }
};

export const exploreFolderQueryOptions = (userId: string, folderId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.FOLDER(userId, folderId),
    queryFn: () => getExploreFolder(userId, folderId),
  });
