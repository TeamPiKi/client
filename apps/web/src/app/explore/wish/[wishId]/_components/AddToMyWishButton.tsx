'use client';

import { useQueryClient } from '@tanstack/react-query';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { QUERY_KEYS } from '@/consts/queryKeys';

import { usePostExploreWish } from '../../../_common/_hooks/usePostExploreWish';
import type { ExploreWishDetailT } from '../_types/exploreWish';

type AddToMyWishButtonProps = {
  wishId: number;
  isInMyWish: boolean;
};

function AddToMyWishButton({ wishId, isInMyWish }: AddToMyWishButtonProps) {
  const queryClient = useQueryClient();
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  const handleClick = () => {
    postExploreWishMutation(wishId, {
      /** 담은 뒤에는 다시 담지 못하도록 상세 캐시를 담은 상태로 바꿈 */
      onSuccess: () =>
        queryClient.setQueryData<ExploreWishDetailT | null>(
          QUERY_KEYS.EXPLORE.WISH(wishId),
          prev => prev && { ...prev, isInMyWish: true }
        ),
    });
  };

  return (
    <BottomCta hasGradient>
      <Button
        size="lg"
        disabled={isInMyWish}
        isLoading={isPostExploreWishPending}
        onClick={handleClick}
      >
        내 위시로 담기
      </Button>
    </BottomCta>
  );
}

export default AddToMyWishButton;
