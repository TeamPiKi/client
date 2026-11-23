'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Button from '@/components/button';
import Basket from '@/components/common/basket';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import type { GuestBlockLocationT } from '@/consts/guestBlockLocation';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';
import { setLoginSource } from '@/utils/loginSource';

type GuestLoginSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 로그인 성공 후 복귀 경로 */
  redirectPath: string;
  /** 차단 지점 식별자 — 노출·클릭 이벤트의 location */
  location: GuestBlockLocationT;
};

/** 게스트가 담기를 누르면 로그인을 유도하는 시트 */
function GuestLoginSheet({ open, onOpenChange, redirectPath, location }: GuestLoginSheetProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BLOCK_VIEW, { location });
  }, [open, location]);

  const handleLoginClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BLOCK_CTA_CLICK, { location });
    /** 로그인·OAuth 를 거치며 location 이 사라지므로 가입 완료까지 들고 갈 유입 지점을 남긴다 */
    setLoginSource(location);
    router.push(getLoginPath(redirectPath));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col items-center gap-4 pt-3 pb-6">
          <Basket type="heart" className="size-15" />
          <div className="flex flex-col items-center gap-1 text-center">
            <DrawerTitle className="body-1-semibold text-text-neutral-primary">
              로그인하고 내 위시로 담아보세요
            </DrawerTitle>
            <DrawerDescription className="caption-1-regular text-text-neutral-secondary">
              위시를 담고, 친구를 추가할 수 있어요
            </DrawerDescription>
          </div>
        </div>
        <Button size="lg" onClick={handleLoginClick}>
          로그인하러 가기
        </Button>
      </DrawerContent>
    </Drawer>
  );
}

export default GuestLoginSheet;
