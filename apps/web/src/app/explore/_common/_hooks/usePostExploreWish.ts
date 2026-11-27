import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExploreWish } from '../_apis/postExploreWish';
import { useExploreSaveToast } from './useExploreSaveToast';
import { useExploreSavedCache } from './useExploreSavedCache';

/** 다른 사람의 위시를 내 전체 위시에 담기 */
export const usePostExploreWish = () => {
  const updateSavedCache = useExploreSavedCache();
  const showSaveToast = useExploreSaveToast();

  const { mutate: postExploreWishMutation, isPending: isPostExploreWishPending } = useMutation({
    mutationFn: postExploreWish,
    onSuccess: async ({ wishId: savedWishId, alreadySaved }, wishId) => {
      await updateSavedCache(node => node.wishId === wishId, { isInMyWish: true, savedWishId });
      showSaveToast(alreadySaved);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postExploreWishMutation, isPostExploreWishPending };
};
