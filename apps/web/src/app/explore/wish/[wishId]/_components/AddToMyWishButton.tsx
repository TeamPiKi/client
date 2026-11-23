'use client';

import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import GuestLoginSheet from '../../../_common/_components/GuestLoginSheet';
import { usePostExploreWish } from '../../../_common/_hooks/usePostExploreWish';

type AddToMyWishButtonProps = {
  wishId: number;
  isInMyWish: boolean;
};

function AddToMyWishButton({ wishId, isInMyWish }: AddToMyWishButtonProps) {
  const { userData } = useGetMe();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  const handleClick = () => {
    if (userData.identityType === 'GUEST') {
      setIsLoginSheetOpen(true);
      return;
    }

    postExploreWishMutation(wishId);
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
