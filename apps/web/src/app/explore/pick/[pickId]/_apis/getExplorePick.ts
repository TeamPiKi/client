import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { getApiErrorStatus } from '@/utils/apiError';

import type { ExplorePickDetailT } from '../../../_common/_types/explore';
import type { GetExplorePickResponseT } from '../_types/explorePick';

/** 지운 1위·고른 사람이 가려진 1위는 서버가 404 로 응답하므로 null 로 바꿔 볼 수 없는 화면으로 보냄 */
export const getExplorePick = async (pickId: number): Promise<ExplorePickDetailT | null> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  try {
    const { data } = await api.get<ApiResponseT<GetExplorePickResponseT>>(
      ENDPOINTS.EXPLORE_PICK(pickId)
    );
    const { candidateId, saved, savedUserCount, item, picker, tournament } = data.data;

    return {
      pickId,
      candidateId,
      item: {
        name: item.name ?? '',
        price: item.price ?? 0,
        discountRate: item.discountRate,
        imageUrl: item.imageUrl ?? '',
        sourceUrl: item.sourceUrl,
      },
      isInMyWish: saved,
      savedCount: savedUserCount,
      owner: {
        userId: picker.userId,
        nickname: picker.nickname,
        profileImage: picker.profileImage,
        isFriend: picker.relation === 'FRIEND',
      },
      folder: picker.folder ? { id: picker.folder.folderId, name: picker.folder.name } : null,
      winnerTournament: {
        pickId,
        title: tournament.name,
        candidateCount: tournament.candidateCount,
        candidateImageUrls: tournament.candidateImageUrls,
      },
    };
  } catch (error) {
    if (getApiErrorStatus(error) === 404) return null;
    throw error;
  }
};

export const explorePickQueryOptions = (pickId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.PICK(pickId),
    queryFn: () => getExplorePick(pickId),
  });
