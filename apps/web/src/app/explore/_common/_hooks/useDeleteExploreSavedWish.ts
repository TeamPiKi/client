import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteWish } from '@/apis/deleteWish';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { useExploreSavedCache } from './useExploreSavedCache';

/** 탐색 하트로 담은 내 위시 삭제 — 탐색 전부터 갖고 있던 상품도 같은 위시라 함께 삭제됨 */
export const useDeleteExploreSavedWish = () => {
  const updateSavedCache = useExploreSavedCache();

  const { mutate: deleteExploreSavedWishMutation, isPending: isDeleteExploreSavedWishPending } =
    useMutation({
      mutationFn: deleteWish,
      onSuccess: async (_, savedWishId) => {
        /** 같은 상품의 카드는 모두 같은 내 위시 id 를 가져 한 번에 비움 */
        await updateSavedCache(node => node.savedWishId === savedWishId, {
          isInMyWish: false,
          savedWishId: null,
        });
        toast('내 위시에서 뺐어요');
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
      },
    });

  return { deleteExploreSavedWishMutation, isDeleteExploreSavedWishPending };
};
