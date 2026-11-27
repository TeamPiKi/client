import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExplorePickCandidate } from '../_apis/postExplorePickCandidate';
import { useExploreSaveToast } from './useExploreSaveToast';
import { useExploreSavedCache } from './useExploreSavedCache';

/** 토너먼트 1위·후보 상품을 내 전체 위시에 담기 */
export const usePostExplorePickCandidate = () => {
  const updateSavedCache = useExploreSavedCache();
  const showSaveToast = useExploreSaveToast();

  const { mutate: postExplorePickCandidateMutation, isPending: isPostExplorePickCandidatePending } =
    useMutation({
      mutationFn: postExplorePickCandidate,
      onSuccess: async ({ wishId: savedWishId, alreadySaved }, { candidateId }) => {
        /** 같은 토너먼트의 1위는 참여자마다 따로 있어 후보 id 가 같은 카드·상세를 모두 바꿈 */
        await updateSavedCache(node => node.candidateId === candidateId, {
          isInMyWish: true,
          savedWishId,
        });
        showSaveToast(alreadySaved);
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
      },
    });

  return { postExplorePickCandidateMutation, isPostExplorePickCandidatePending };
};
