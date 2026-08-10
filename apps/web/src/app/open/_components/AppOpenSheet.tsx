'use client';

import { buttonStyles } from '@/components/button/button.style';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';

type AppOpenSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 앱을 여는 URL — 스킴 / Universal Link / intent 중 환경에 맞는 하나 */
  appOpenUrl: string | null;
  storeUrl: string | null;
  onAppOpenClick: () => void;
  onStoreClick: () => void;
  onWebContinueClick: () => void;
};

function AppOpenSheet({
  open,
  onOpenChange,
  appOpenUrl,
  storeUrl,
  onAppOpenClick,
  onStoreClick,
  onWebContinueClick,
}: AppOpenSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <DrawerTitle className="heading-1-bold text-text-neutral-primary">
              PiKi 앱에서 열까요?
            </DrawerTitle>
            <DrawerDescription className="body-1-medium text-text-neutral-secondary">
              앱에서 더 빠르게 위시를 모으고 토너먼트를 열 수 있어요.
            </DrawerDescription>
          </div>

          <div className="flex flex-col gap-2">
            {/** 함정 1 — 앱을 열려면 반드시 `<a>` 여야 한다. JS 이동은 Universal Link 를 발동시키지 않는다 */}
            {appOpenUrl && (
              <a
                href={appOpenUrl}
                onClick={onAppOpenClick}
                className={buttonStyles({ variant: 'primary', size: 'lg' })}
              >
                앱으로 열기
              </a>
            )}

            {storeUrl && (
              <a
                href={storeUrl}
                onClick={onStoreClick}
                className={buttonStyles({ variant: 'secondary', size: 'lg' })}
              >
                스토어에서 받기
              </a>
            )}

            {/** 함정 1 — `<a>` 로 걸면 크로스 도메인 UL 이 발동해 앱으로 끌려간다 */}
            <button
              type="button"
              onClick={onWebContinueClick}
              className="cursor-pointer py-3 body-2-medium text-text-neutral-tertiary"
            >
              웹으로 계속 보기
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AppOpenSheet;
