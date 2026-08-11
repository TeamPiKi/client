'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import BasketGuestIcon from '@/assets/images/basket-guest.svg';
import { buttonStyles } from '@/components/button/button.style';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';

function TournamentGuestEmptyState() {
  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_VIEW, { location: 'home_empty' });
  }, []);

  const handleLoginClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_CTA_CLICK, { location: 'home_empty' });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <BasketGuestIcon className="size-[60px]" aria-hidden />
      <div className="flex flex-col gap-1 text-center">
        <p className="body-1-medium text-text-neutral-secondary">아직 로그인 전이세요?</p>
        <p className="body-1-semibold text-gray-800">지금 가입하고 위시 한 곳에서 관리하기</p>
      </div>
      <Link
        href={getLoginPath(ROUTES.HOME)}
        onClick={handleLoginClick}
        className={`${buttonStyles({ variant: 'secondary', size: 'sm' })} w-[101px]`}
      >
        로그인
      </Link>
    </div>
  );
}

export default TournamentGuestEmptyState;
