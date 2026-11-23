'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { HeartIconFill, HeartIconOutline } from '@/assets/icons';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';

import GuestLoginSheet from '../_common/_components/GuestLoginSheet';
import { usePostExploreWish } from '../_common/_hooks/usePostExploreWish';

type WishHeartButtonProps = {
  wishId: number;
  isInMyWish: boolean;
};

function WishHeartButton({ wishId, isInMyWish }: WishHeartButtonProps) {
  const pathname = usePathname();

  const { userData } = useGetMe();
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const handleClick = () => {
    if (userData.identityType === 'GUEST') {
      setIsLoginSheetOpen(true);
      return;
    }

    postExploreWishMutation(wishId);
  };

  return (
    <>
      <button
        type="button"
        aria-label={isInMyWish ? '내 위시에 담긴 상품' : '내 위시로 담기'}
        aria-pressed={isInMyWish}
        disabled={isInMyWish || isPostExploreWishPending}
        onClick={handleClick}
        className="absolute top-[7px] right-[7px] grid size-10 cursor-pointer place-items-center disabled:cursor-default [&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:size-6"
        style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
      >
        {isInMyWish ? (
          <HeartIconFill className="text-red-400" aria-hidden />
        ) : (
          <>
            <HeartIconFill className="text-black/8" aria-hidden />
            <HeartIconOutline className="text-white" aria-hidden />
          </>
        )}
      </button>

      <GuestLoginSheet
        open={isLoginSheetOpen}
        onOpenChange={setIsLoginSheetOpen}
        redirectPath={pathname}
        location={GUEST_BLOCK_LOCATION.EXPLORE_CARD_SAVE}
      />
    </>
  );
}

export default WishHeartButton;
