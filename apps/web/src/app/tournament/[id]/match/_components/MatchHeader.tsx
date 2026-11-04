'use client';

import { Header, HeaderIcon } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

function MatchHeader() {
  const backWithFallback = useBackWithFallback();

  return (
    <div className="w-full bg-[#CEEEFE] px-4 pt-padding-top">
      <Header
        className="h-11"
        left={<HeaderIcon name="BACK" onClick={() => backWithFallback(ROUTES.HOME)} />}
      />
    </div>
  );
}

export default MatchHeader;
