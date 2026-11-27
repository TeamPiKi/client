import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** globals.css 의 좌우 안전 영역 토큰. 등록해야 `inset-0` 등이 `left-safe-center` 를 덮어씀 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['safe-left', 'safe-right', 'safe-x', 'safe-center'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
