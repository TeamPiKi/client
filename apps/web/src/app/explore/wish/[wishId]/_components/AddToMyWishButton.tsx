'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import GuestLoginSheet from '../../../_common/_components/GuestLoginSheet';
import { usePostExploreWish } from '../../../_common/_hooks/usePostExploreWish';
import type { ExploreWishDetailT } from '../_types/exploreWish';

type AddToMyWishButtonProps = {
  wishId: number;
  isInMyWish: boolean;
};

function AddToMyWishButton({ wishId, isInMyWish }: AddToMyWishButtonProps) {
  const queryClient = useQueryClient();
  const { userData } = useGetMe();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  const handleClick = () => {
    if (userData.identityType === 'GUEST') {
      setIsLoginSheetOpen(true);
      return;
    }

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
    <>
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

      <GuestLoginSheet
        open={isLoginSheetOpen}
        onOpenChange={setIsLoginSheetOpen}
        redirectPath={ROUTES.EXPLORE_WISH(wishId)}
        location={GUEST_BLOCK_LOCATION.EXPLORE_WISH_SAVE}
      />
    </>
  );
}

export default AddToMyWishButton;
