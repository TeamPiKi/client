'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LockIconFill } from '@/assets/icons';
import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import type { GuestBlockLocationT } from '@/consts/guestBlockLocation';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';
import { setLoginSource } from '@/utils/loginSource';

type LoginRequiredProps = {
  /** 지점별 안내 문구 — loginRequired.const.ts 카탈로그에서 주입 */
  title: string;
  /** 로그인 성공 후 복귀 경로 */
  redirectPath: string;
  /** 차단 지점 식별자 — 노출·클릭 이벤트의 location */
  location: GuestBlockLocationT;
  /** '이전으로 돌아가기' 동작 (오버레이는 닫기, 라우트 전체 화면은 LoginRequiredPage 경유 back) */
  onGoBack: () => void;
};

/** 게스트가 잠긴 기능에 접근할 때 로그인을 유도하는 전체 화면 */
function LoginRequired({ title, redirectPath, location, onGoBack }: LoginRequiredProps) {
  const router = useRouter();

  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BLOCK_VIEW, { location });
  }, [location]);

  const handleLoginClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BLOCK_CTA_CLICK, { location });
    /** 로그인·OAuth 를 거치며 location 이 사라지므로 가입 완료까지 들고 갈 유입 지점을 남긴다 */
    setLoginSource(location);
    router.push(getLoginPath(redirectPath));
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-linear-to-b from-white to-gray-50 px-5 pt-padding-top">
      <Header left={<PiKiLogo aria-label="PIKI" />} right={<HeaderIcon name="ALARM" />} />

      <main className="flex flex-1 flex-col items-center justify-center gap-[25px] pb-[100px]">
        <LockIconFill width={60} height={60} className="text-sky-blue-400" aria-hidden />

        <div className="flex flex-col items-center gap-[30px]">
          <h2 className="heading-1-semibold text-text-neutral-primary">{title}</h2>

          <div className="flex flex-col items-center gap-6">
            <Button variant="primary" size="md" onClick={handleLoginClick}>
              로그인하기
            </Button>
            <button
              type="button"
              onClick={onGoBack}
              className="cursor-pointer body-1-medium text-text-neutral-secondary"
            >
              이전으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginRequired;
