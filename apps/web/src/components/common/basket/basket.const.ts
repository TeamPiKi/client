import type { FC, SVGProps } from 'react';

import BasketConfusedIcon from '@/assets/images/basket/confused.svg';
import BasketDefaultIcon from '@/assets/images/basket/default.svg';
import BasketHeartIcon from '@/assets/images/basket/heart.svg';
import BasketPanicIcon from '@/assets/images/basket/panic.svg';

import type { BasketTypeT } from './basket.types';

export const BASKET_ICON: Record<BasketTypeT, FC<SVGProps<SVGSVGElement>>> = {
  default: BasketDefaultIcon,
  confused: BasketConfusedIcon,
  panic: BasketPanicIcon,
  heart: BasketHeartIcon,
};
