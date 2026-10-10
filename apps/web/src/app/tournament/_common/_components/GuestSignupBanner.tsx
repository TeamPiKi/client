'use client';

import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { useEffect } from 'react';

import { ChevronForwardIconFill } from '@/assets/icons/fill';
import GuestSignupIllustration from '@/assets/images/result-guest-banner-illustration.svg';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import type { LoginSourceT } from '@/consts/loginSource';
import { logAnalyticsEvent } from '@/utils/analytics';
import { setLoginSource } from '@/utils/loginSource';

type GuestSignupBannerProps = {
  loginHref: string;
  location: LoginSourceT;
  variant?: 'filled' | 'plain';
};

const bannerStyles = cva('flex w-full cursor-pointer items-center justify-between gap-3', {
  variants: {
    variant: {
      filled: 'h-[81px] rounded-xl bg-[#E1F0F9] px-4',
      plain: '',
    },
  },
});

const titleStyles = cva('flex items-center gap-0.5 body-1-semibold', {
  variants: {
    variant: {
      filled: 'text-text-neutral-secondary',
      plain: 'text-text-neutral-primary',
    },
  },
});

function GuestSignupBanner({ loginHref, location, variant = 'filled' }: GuestSignupBannerProps) {
  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_VIEW, { location });
  }, [location]);

  const handleClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_CTA_CLICK, { location });
    /** 로그인·OAuth 를 거치며 location 이 사라지므로 가입 완료까지 들고 갈 유입 지점을 남긴다 */
    setLoginSource(location);
  };

  return (
    <Link href={loginHref} onClick={handleClick} className={bannerStyles({ variant })}>
      <div className="mx-2 flex min-w-0 flex-col gap-0.5">
        <p className="body-2-regular text-text-neutral-secondary">아직 로그인 전이세요?</p>
        <p className={titleStyles({ variant })}>
          가입하고 토너먼트 주최하기
          {variant === 'plain' && (
            <ChevronForwardIconFill className="size-5 text-icon-neutral-primary" aria-hidden />
          )}
        </p>
      </div>

      <GuestSignupIllustration aria-hidden className="h-[53px] w-[87px] shrink-0" />
    </Link>
  );
}

export default GuestSignupBanner;
