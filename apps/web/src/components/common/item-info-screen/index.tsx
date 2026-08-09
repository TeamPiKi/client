'use client';

import type { ItemStatusT, PatchItemRequestT } from '@/types/item';

import FailedItemEditForm from './FailedItemEditForm';
import ReadyItemInfoSection from './ReadyItemInfoSection';

type ItemInfoScreenProps = {
  sourceUrl?: string | null;
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
  onSave?: (data: PatchItemRequestT) => void;
  isSavePending?: boolean;
  onDelete: () => void;
  isDeletePending?: boolean;
  onRefresh?: () => void;
  isRefreshPending?: boolean;
};

function ItemInfoScreen({ itemStatus, ...props }: ItemInfoScreenProps) {
  if (itemStatus === 'FAILED') return <FailedItemEditForm itemStatus={itemStatus} {...props} />;

  if (itemStatus === 'READY') return <ReadyItemInfoSection itemStatus={itemStatus} {...props} />;

  return null;
}

export default ItemInfoScreen;
