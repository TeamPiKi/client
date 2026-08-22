'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import ResultGuestBannerIllustration from '@/assets/images/result-guest-banner-illustration.svg';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';

function ResultGuestBanner() {
  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_VIEW, { location: 'result' });
  }, []);

  const handleClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_CTA_CLICK, { location: 'result' });
  };

  return (
    <Link
      href={getLoginPath(ROUTES.HOME)}
      onClick={handleClick}
      className="relative flex h-[81px] w-full items-center overflow-hidden rounded-xl bg-[#E1F0F9] px-4"
    >
      <div className="flex flex-col gap-0.5 pr-[104px]">
        <p className="body-2-regular text-text-neutral-secondary">아직 로그인 전이세요?</p>
        <p className="body-1-semibold text-text-neutral-secondary">가입하고 토너먼트 주최하기</p>
      </div>

      <ResultGuestBannerIllustration
        aria-hidden
        className="absolute top-[14.25px] right-[18px] h-[53px] w-[87px]"
      />
    </Link>
  );
}

export default ResultGuestBanner;
