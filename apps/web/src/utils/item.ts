import type { ItemStatusT } from '@/types/item';

export const hasParsingItems = (items: { status?: ItemStatusT }[]) =>
  items.some(item => item.status === 'PENDING' || item.status === 'PROCESSING');
