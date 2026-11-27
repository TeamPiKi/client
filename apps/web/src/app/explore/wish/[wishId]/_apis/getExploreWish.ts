import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { getApiErrorStatus } from '@/utils/apiError';

import type { ExploreWishDetailT } from '../../../_common/_types/explore';
import type { GetExploreWishResponseT } from '../_types/exploreWish';

/** 서버가 없는 위시·파싱 중·실패 위시를 404 로 응답하므로 null 로 바꿔 볼 수 없는 화면으로 보냄 */
export const getExploreWish = async (wishId: number): Promise<ExploreWishDetailT | null> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  try {
    const { data } = await api.get<ApiResponseT<GetExploreWishResponseT>>(
      ENDPOINTS.EXPLORE_WISH(wishId)
    );
    const { saved, savedWishId, savedUserCount, item, owner } = data.data;

    return {
      wishId,
      item: {
        name: item.name ?? '',
        price: item.price ?? 0,
        discountRate: item.discountRate,
        imageUrl: item.imageUrl ?? '',
        sourceUrl: item.sourceUrl,
      },
      isInMyWish: saved,
      savedWishId,
      savedCount: savedUserCount,
      owner: owner && {
        userId: owner.userId,
        nickname: owner.nickname,
        profileImage: owner.profileImage,
        isFriend: owner.relation === 'FRIEND',
      },
      folder: owner?.folder ? { id: owner.folder.folderId, name: owner.folder.name } : null,
      winnerTournament: null,
    };
  } catch (error) {
    if (getApiErrorStatus(error) === 404) return null;
    throw error;
  }
};

export const exploreWishQueryOptions = (wishId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.WISH(wishId),
    queryFn: () => getExploreWish(wishId),
  });
