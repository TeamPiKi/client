'use client';

import { useState } from 'react';

import Tooltip from '@/components/common/tooltip';
import type { AbVariantT } from '@/consts/abTest';
import { Z_INDEX } from '@/consts/zIndex';

import { TOOLTIP_CONTENT } from './tooltipAb.const';

type TooltipAbProps = {
  variant: AbVariantT;
};

function TooltipAb({ variant }: TooltipAbProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  const { Icon, iconClassName, message } = TOOLTIP_CONTENT[variant];

  if (isDismissed) return null;

  const handleClick = (event: React.MouseEvent) => {
    /** NOTE: 버튼 안에 렌더되어 전파되면 토너먼트 생성 클릭으로 집계됨 */
    event.stopPropagation();
    setIsDismissed(true);
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
