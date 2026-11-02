const MAX_DISPLAY_COUNT = 999;

export const formatWishCount = (count: number) =>
  count > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : String(count);
