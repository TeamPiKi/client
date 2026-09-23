'use client';

import { useState } from 'react';

import Tooltip from '@/components/common/tooltip';
import type { AbVariantT } from '@/consts/abTest';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { logAnalyticsEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';

import { TOOLTIP_CONTENT } from './tooltipAb.const';

type TooltipAbProps = {
  variant: AbVariantT;
};

function TooltipAb({ variant }: TooltipAbProps) {
  const { userData } = useGetMe();

  const [isClicked, setIsClicked] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const { Icon, iconClassName, message } = TOOLTIP_CONTENT[variant];

  if (isRemoved) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (isClicked) return;

    setIsClicked(true);
    logAnalyticsEvent(ANALYTICS_EVENT.TOOLTIP_DISMISS, {
      tooltip_variant: variant,
      identity_type: userData.identityType,
    });

    /** NOTE: 모션 감소 설정은 페이드 없이 즉시 제거 — transitionend 에 기대면 언마운트가 안 됨 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsRemoved(true);
  };

  return (
    <div
      onClick={handleClick}
      onTransitionEnd={() => isClicked && setIsRemoved(true)}
      className={cn(
        'absolute -top-11 right-0 cursor-pointer transition-opacity duration-100 ease-out',
        /** NOTE: pointer-events 는 유지 — 끄면 페이드 중 클릭이 뚫고 아래 요소를 실행함 */
        isClicked && 'opacity-0'
      )}
      style={{ zIndex: Z_INDEX.BASE + 1 }}
    >
      <Tooltip icon={<Icon aria-hidden className={`size-4.5 shrink-0 ${iconClassName}`} />}>
        {message}
      </Tooltip>
    </div>
  );
}

export default TooltipAb;
