'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import ResultGuestBannerGroupIllustration from '@/assets/images/result-guest-banner-group.svg';
import UserProfileGreenIcon from '@/assets/images/user-profile-green.svg';
import UserProfileYellowIcon from '@/assets/images/user-profile-yellow.svg';
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

      {/* 노란 이모지 — 그룹 일러스트 뒤에 위치 */}
      <UserProfileYellowIcon
        aria-hidden
        style={{
          position: 'absolute',
          right: '21.59px',
          top: '15px',
          width: '21.396px',
          height: '21.396px',
          transform: 'rotate(12.047deg)',
        }}
      />
      {/* 그룹 일러스트 (블루 카드 + 하트 + 스파클) */}
      <ResultGuestBannerGroupIllustration
        aria-hidden
        style={{
          position: 'absolute',
          right: '19.27px',
          top: '14.25px',
          height: '52.087px',
          width: '77.711px',
        }}
      />
      {/* 초록 이모지 — 그룹 일러스트 앞에 위치 */}
      <UserProfileGreenIcon
        aria-hidden
        style={{
          position: 'absolute',
          right: '84.5px',
          top: '39.63px',
          width: '22px',
          height: '23px',
        }}
      />
    </Link>
  );
}

export default ResultGuestBanner;
