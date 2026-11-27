import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExplorePickCandidate } from '../_apis/postExplorePickCandidate';
import type { ExplorePickCandidatesT, ExplorePickDetailT, WinnerWishT } from '../_types/explore';
import { useExploreSaveToast } from './useExploreSaveToast';

/** 토너먼트 1위·후보 상품을 내 전체 위시에 담기 */
export const usePostExplorePickCandidate = () => {
  const queryClient = useQueryClient();
  const showSaveToast = useExploreSaveToast();

  const { mutate: postExplorePickCandidateMutation, isPending: isPostExplorePickCandidatePending } =
    useMutation({
      mutationFn: postExplorePickCandidate,
      onSuccess: ({ alreadySaved }, { candidateId }) => {
        queryClient.invalidateQueries({ queryKey: ['wishlists'] });
        /** 같은 토너먼트의 1위는 참여자마다 따로 있어 후보 id 가 같은 캐시를 모두 담은 상태로 바꿈 */
        queryClient.setQueryData<InfiniteData<ApiResponseT<WinnerWishT[]>>>(
          QUERY_KEYS.EXPLORE.WINNERS,
          prev =>
            prev && {
              ...prev,
              pages: prev.pages.map(page => ({
                ...page,
                data: page.data.map(pick =>
                  pick.candidateId === candidateId ? { ...pick, isInMyWish: true } : pick
                ),
              })),
            }
        );
        queryClient.setQueriesData<ExplorePickDetailT | null>(
          { queryKey: ['explore', 'pick'] },
          prev => (prev?.candidateId === candidateId ? { ...prev, isInMyWish: true } : prev)
        );
        queryClient.setQueriesData<ExplorePickCandidatesT | null>(
          { queryKey: ['explore', 'candidates'] },
          prev =>
            prev && {
              ...prev,
              candidates: prev.candidates.map(candidate =>
                candidate.candidateId === candidateId
                  ? { ...candidate, isInMyWish: true }
                  : candidate
              ),
            }
        );
        showSaveToast(alreadySaved);
      },
      onError: error => {
        if (isGlobalNetError(error)) return;

        toast.error(getApiErrorMessage(error));
      },
    });

  return { postExplorePickCandidateMutation, isPostExplorePickCandidatePending };
};
