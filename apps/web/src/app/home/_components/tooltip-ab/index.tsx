'use client';

import { useState } from 'react';

import Tooltip from '@/components/common/tooltip';
import type { AbVariantT } from '@/consts/abTest';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { logAnalyticsEvent } from '@/utils/analytics';

import { TOOLTIP_CONTENT } from './tooltipAb.const';

type TooltipAbProps = {
  variant: AbVariantT;
};

function TooltipAb({ variant }: TooltipAbProps) {
  const { userData } = useGetMe();

  const [isDismissed, setIsDismissed] = useState(false);

  const { Icon, iconClassName, message } = TOOLTIP_CONTENT[variant];

  if (isDismissed) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsDismissed(true);
    logAnalyticsEvent(ANALYTICS_EVENT.TOOLTIP_DISMISS, {
      tooltip_variant: variant,
      identity_type: userData.identityType,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="absolute -top-11 right-0 cursor-pointer"
      style={{ zIndex: Z_INDEX.BASE + 1 }}
    >
      <Tooltip icon={<Icon aria-hidden className={`size-4.5 shrink-0 ${iconClassName}`} />}>
        {message}
      </Tooltip>
    </div>
  );
}

export default TooltipAb;
