'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { CloseIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { APP_UPDATE_PROMPT } from '@/consts/appUpdate';
import { ONBOARDING_KEY } from '@/consts/onboarding';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { hasDismissedAppUpdate, markAppUpdateDismissed, openAppStore } from '@/utils/appUpdate';
import { getRouteType } from '@/utils/getRouteType';
import { hasSeenOnboarding } from '@/utils/onboarding';

const { targetVersion, badge, title, description, Illustration } = APP_UPDATE_PROMPT;

/** 딥링크로 진입하는 첫 화면 — 초대 유입을 모달이 가로막지 않도록 제외 */
const isDeepLinkEntryRoute = (pathname: string) =>
  pathname.startsWith(ROUTES.TOURNAMENT_JOIN_BY_CODE) || pathname.startsWith('/play');

/** 로그인·온보딩 등 오버레이가 이미 뜨는 공개 라우트도 함께 제외 */
const isExcludedRoute = (pathname: string) =>
  getRouteType(pathname) === 'PUBLIC' || isDeepLinkEntryRoute(pathname);

function AppUpdateDialog() {
  const pathname = usePathname();
  /** 모달 닫힘 여부 */
  const [isClosed, setIsClosed] = useState(false);
  /** 이번 세션(앱 실행)에서 이미 닫았는지 */
  const [hasDismissed] = useState(() => hasDismissedAppUpdate(targetVersion));
  const hasLoggedViewRef = useRef(false);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  /** 홈 온보딩 오버레이와 겹치지 않도록 홈 온보딩이 뜰 차례면 건너뛴다 */
  const isHomeOnboardingVisible =
    pathname === ROUTES.HOME && !hasSeenOnboarding(ONBOARDING_KEY.HOME);

  const isOpen =
    isMounted &&
    !isClosed &&
    !hasDismissed &&
    !isExcludedRoute(pathname) &&
    !isHomeOnboardingVisible;

  useEffect(() => {
    if (!isOpen || hasLoggedViewRef.current) return;

    hasLoggedViewRef.current = true;
    logAnalyticsEvent(ANALYTICS_EVENT.APP_UPDATE_PROMPT_VIEW, { target_version: targetVersion });
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsClosed(true);
    markAppUpdateDismissed(targetVersion);
    logAnalyticsEvent(ANALYTICS_EVENT.APP_UPDATE_PROMPT_DISMISS, { target_version: targetVersion });
  };

  const handleUpdateClick = () => {
    setIsClosed(true);
    markAppUpdateDismissed(targetVersion);
    logAnalyticsEvent(ANALYTICS_EVENT.APP_UPDATE_PROMPT_CLICK, { target_version: targetVersion });
    openAppStore();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center">
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-2 right-2 flex size-11 cursor-pointer items-center justify-center"
          >
            <CloseIconFill />
            <span className="sr-only">닫기</span>
          </button>
        </DialogClose>
        <div className="flex flex-col items-center gap-2 pt-1">
          <span className="rounded-lg bg-sky-blue-50 px-2 py-1 caption-1-semibold text-text-accent">
            {badge}
          </span>
          <DialogTitle className="heading-1-bold text-text-neutral-primary">{title}</DialogTitle>
          <DialogDescription className="text-center body-1-medium whitespace-pre-line text-text-neutral-secondary">
            {description}
          </DialogDescription>
        </div>
        <Illustration aria-hidden className="mt-9 mb-8 h-16 w-auto" />
        <Button size="lg" onClick={handleUpdateClick}>
          지금 업데이트 하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AppUpdateDialog;
