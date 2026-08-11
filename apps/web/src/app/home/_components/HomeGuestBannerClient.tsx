'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import BasketGuestIcon from '@/assets/images/basket-guest.svg';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';

/** 게스트 + 토너먼트 1개 이상일 때 헤더 아래 노출되는 가로형 배너.
 *  토너먼트 0개면 24px 스페이서를 반환해 레이아웃을 유지한다. */
function HomeGuestBannerClient() {
  const { tournamentListData } = useGetTournamentList({ limit: 3 });
  const hasItems = tournamentListData.length > 0;

  useEffect(() => {
    if (!hasItems) return;
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_VIEW, { location: 'home_list' });
  }, [hasItems]);

  if (!hasItems) return null;

  const handleClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_CTA_CLICK, { location: 'home_list' });
  };

  return (
    <Link
      href={getLoginPath(ROUTES.HOME)}
      onClick={handleClick}
      className="flex items-center gap-[9px] pt-4 pb-3 pr-[61.5px]"
    >
      <BasketGuestIcon className="size-[52px] shrink-0" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <p className="body-2-regular text-gray-800">아직 로그인 전이세요?</p>
        <p className="body-1-semibold text-gray-800">지금 가입하고 위시 한 곳에서 관리하기</p>
      </div>
    </Link>
  );
}

export default HomeGuestBannerClient;
