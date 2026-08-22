import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT } from '@/types/item';

export const hasParsingItems = (items: { status?: ItemStatusT }[]) =>
  items.some(item => item.status === ITEM_STATUS.PENDING || item.status === ITEM_STATUS.PROCESSING);
