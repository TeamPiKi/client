'use client';

import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { useGetMe } from '@/hooks/useGetMe';

import GuestLoginSheet from './GuestLoginSheet';

type SaveToMyWishCtaProps = {
  isInMyWish: boolean;
  isPending: boolean;
  onSave: () => void;
  /** 게스트가 로그인 후 돌아올 경로 */
  redirectPath: string;
};

/** 상세 하단 [내 위시로 담기] — 게스트는 로그인 시트, 회원은 onSave */
function SaveToMyWishCta({ isInMyWish, isPending, onSave, redirectPath }: SaveToMyWishCtaProps) {
  const { userData } = useGetMe();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const handleClick = () => {
    if (userData.identityType === 'GUEST') {
      setIsLoginSheetOpen(true);
      return;
    }

    onSave();
  };

  return (
    <>
      <BottomCta hasGradient>
        <Button size="lg" disabled={isInMyWish} isLoading={isPending} onClick={handleClick}>
          내 위시로 담기
        </Button>
      </BottomCta>

      <GuestLoginSheet
        open={isLoginSheetOpen}
        onOpenChange={setIsLoginSheetOpen}
        redirectPath={redirectPath}
        location={GUEST_BLOCK_LOCATION.EXPLORE_WISH_SAVE}
      />
    </>
  );
}

export default SaveToMyWishCta;
