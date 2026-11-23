import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';

import { RECENT_WISHES_MOCK } from '../../../../_common/_consts/exploreMock';
import type { ExploreFolderT } from '../../../../_common/_types/explore';

/** TEMP: API 연동 전이라 방금 담긴 위시 목데이터로 폴더를 만들어 반환함. folderId 가 5의 배수면 볼 수 없는 폴더 */
export const getExploreFolder = async (
  _userId: string,
  folderId: number
): Promise<ExploreFolderT | null> => {
  if (folderId % 5 === 0) return null;

  return {
    folderId,
    name: '겨울 대비',
    wishes: RECENT_WISHES_MOCK.slice(0, 12).map(({ wishId, item, isInMyWish }) => ({
      wishId,
      item,
      isInMyWish,
    })),
  };
};

export const exploreFolderQueryOptions = (userId: string, folderId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.FOLDER(userId, folderId),
    queryFn: () => getExploreFolder(userId, folderId),
  });
