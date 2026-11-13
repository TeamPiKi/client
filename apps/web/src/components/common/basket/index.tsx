import type { SVGProps } from 'react';

import { cn } from '@/utils/cn';

import { BASKET_ICON } from './basket.const';
import type { BasketTypeT } from './basket.types';

type BasketProps = {
  type: BasketTypeT;
} & Omit<SVGProps<SVGSVGElement>, 'type'>;

function Basket({ type, className, ...props }: BasketProps) {
  const Icon = BASKET_ICON[type];

  return <Icon className={cn('size-15 text-sky-blue-300', className)} aria-hidden {...props} />;
}

export default Basket;
