import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TOAST_ACTION_DURATION_MS } from '@/components/toast/toast.const';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { ROUTES } from '@/consts/route';
import type { ApiResponseT } from '@/types/api';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExploreWish } from '../_apis/postExploreWish';
import type { ExploreWishDetailT, RecentWishT } from '../_types/explore';

/** 다른 사람의 위시를 내 전체 위시에 담기 */
export const usePostExploreWish = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postExploreWishMutation, isPending: isPostExploreWishPending } = useMutation({
    mutationFn: postExploreWish,
    onSuccess: (_, wishId) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      /** 담은 뒤에는 다시 담지 못하도록 상세 캐시를 담은 상태로 바꿈 — 상세를 연 적 없으면 캐시가 없어 그대로 둠 */
      queryClient.setQueryData<ExploreWishDetailT | null>(
        QUERY_KEYS.EXPLORE.WISH(wishId),
        prev => prev && { ...prev, isInMyWish: true }
      );
      queryClient.setQueryData<InfiniteData<ApiResponseT<RecentWishT[]>>>(
        QUERY_KEYS.EXPLORE.RECENT,
        prev =>
          prev && {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              data: page.data.map(wish =>
                wish.wishId === wishId ? { ...wish, isInMyWish: true } : wish
              ),
            })),
          }
      );
      toast('내 위시에 상품을 담았어요', {
        duration: TOAST_ACTION_DURATION_MS,
        action: { label: '보러가기', onClick: () => router.push(ROUTES.WISHLIST) },
        /** 전역 액션 버튼은 회색이지만 이 토스트는 시안대로 흰색 */
        classNames: { actionButton: '[&[data-button]]:!text-text-neutral-inverse' },
      });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postExploreWishMutation, isPostExploreWishPending };
};
