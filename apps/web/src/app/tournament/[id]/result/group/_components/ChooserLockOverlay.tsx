'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { LockIconFill } from '@/assets/icons';
import ChooserLockIllustration from '@/assets/images/tournament/result/chooser-lock-overlay.svg';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { GUEST_BLOCK_LOCATION } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';
import { setLoginSource } from '@/utils/loginSource';

type ChooserLockOverlayProps = {
  tournamentId: number;
  onView: () => void;
};

function ChooserLockOverlay({ tournamentId, onView }: ChooserLockOverlayProps) {
  useEffect(() => {
    onView();
  }, [onView]);

  const handleClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BLOCK_CTA_CLICK, {
      location: GUEST_BLOCK_LOCATION.GROUP_RESULT_MASK,
    });
    /** 로그인·OAuth 를 거치며 location 이 사라지므로 가입 완료까지 들고 갈 유입 지점을 남긴다 */
    setLoginSource(GUEST_BLOCK_LOCATION.GROUP_RESULT_MASK);
  };

  return (
    <div className="relative w-full">
      <ChooserLockIllustration aria-hidden className="h-auto w-full blur-[4px]" />
      <Link
        href={getLoginPath(ROUTES.TOURNAMENT_GROUP_RESULT(tournamentId))}
        onClick={handleClick}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      >
        <LockIconFill aria-hidden className="size-7 text-icon-neutral-primary" />
        <span className="body-2-medium text-text-neutral-secondary underline underline-offset-2">
          로그인하고 결과보기
        </span>
      </Link>
    </div>
  );
}

export default ChooserLockOverlay;
