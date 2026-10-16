import type { WISH_MODE } from '../_consts/wishMode';

export type WishModeT = (typeof WISH_MODE)[keyof typeof WISH_MODE];
