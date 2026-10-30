const MAX_DISPLAY_COUNT = 999;

export const formatWishCount = (count: number, hasMore = false) => {
  if (count > MAX_DISPLAY_COUNT) return `${MAX_DISPLAY_COUNT}+`;
  if (hasMore) return `${count}+`;

  return String(count);
};
