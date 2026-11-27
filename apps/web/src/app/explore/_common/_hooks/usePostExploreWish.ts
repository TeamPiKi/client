import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExploreWish } from '../_apis/postExploreWish';
import type { ExploreFolderT, ExploreWishDetailT, RecentWishesT } from '../_types/explore';
import { useExploreSaveToast } from './useExploreSaveToast';

/** 다른 사람의 위시를 내 전체 위시에 담기 */
export const usePostExploreWish = () => {
  const queryClient = useQueryClient();
  const showSaveToast = useExploreSaveToast();

  const { mutate: postExploreWishMutation, isPending: isPostExploreWishPending } = useMutation({
    mutationFn: postExploreWish,
    onSuccess: ({ alreadySaved }, wishId) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      /** 담은 뒤에는 다시 담지 못하도록 상세 캐시를 담은 상태로 바꿈 — 상세를 연 적 없으면 캐시가 없어 그대로 둠 */
      queryClient.setQueryData<ExploreWishDetailT | null>(
        QUERY_KEYS.EXPLORE.WISH(wishId),
        prev => prev && { ...prev, isInMyWish: true }
      );
      queryClient.setQueriesData<ExploreFolderT | null>(
        { queryKey: ['explore', 'folder'] },
        prev =>
          prev && {
            ...prev,
            wishes: prev.wishes.map(wish =>
              wish.wishId === wishId ? { ...wish, isInMyWish: true } : wish
            ),
          }
      );
      queryClient.setQueryData<InfiniteData<ApiResponseT<RecentWishesT>>>(
        QUERY_KEYS.EXPLORE.RECENT,
        prev =>
          prev && {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                wishes: page.data.wishes.map(wish =>
                  wish.wishId === wishId ? { ...wish, isInMyWish: true } : wish
                ),
              },
            })),
          }
      );
      showSaveToast(alreadySaved);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postExploreWishMutation, isPostExploreWishPending };
};
