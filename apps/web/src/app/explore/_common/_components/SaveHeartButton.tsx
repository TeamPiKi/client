'use client';

import { HAPTIC_STYLE } from '@piki/core';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { HeartIconFill, HeartIconOutline } from '@/assets/icons';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { triggerHaptic } from '@/utils/haptic';

import { useDeleteExploreSavedWish } from '../_hooks/useDeleteExploreSavedWish';
import GuestLoginSheet from './GuestLoginSheet';

type SaveHeartButtonProps = {
  isInMyWish: boolean;
  /** 그 상품을 담은 내 위시 id — 채워진 하트를 다시 누르면 이 위시를 삭제 */
  savedWishId: number | null;
  isPending: boolean;
  onSave: () => void;
};

/** 카드 오른쪽 위 하트 — 게스트는 로그인 시트, 회원은 빈 하트면 onSave · 채워진 하트면 담기 취소 */
function SaveHeartButton({ isInMyWish, savedWishId, isPending, onSave }: SaveHeartButtonProps) {
  const pathname = usePathname();

  const { userData } = useGetMe();
  const { deleteExploreSavedWishMutation, isDeleteExploreSavedWishPending } =
    useDeleteExploreSavedWish();

  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const handleClick = () => {
    if (userData.identityType === 'GUEST') {
      setIsLoginSheetOpen(true);
      return;
    }

    triggerHaptic(HAPTIC_STYLE.LIGHT);
    if (isInMyWish && savedWishId !== null) {
      deleteExploreSavedWishMutation(savedWishId);
      return;
    }

    onSave();
  };

  return (
    <>
      <button
        type="button"
        aria-label={isInMyWish ? '내 위시에 담긴 상품' : '내 위시로 담기'}
        aria-pressed={isInMyWish}
        disabled={
          (isInMyWish && savedWishId === null) || isPending || isDeleteExploreSavedWishPending
        }
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

export default SaveHeartButton;
