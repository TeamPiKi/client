'use client';

import type { ItemStatusT, PatchItemRequestT } from '@/types/item';

import FailedItemEditForm from './FailedItemEditForm';
import ReadyItemInfoSection from './ReadyItemInfoSection';

type ItemEditFormProps = {
  sourceUrl: string | null;
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

function ItemEditForm({ itemStatus, ...props }: ItemEditFormProps) {
  if (itemStatus === 'FAILED') return <FailedItemEditForm itemStatus={itemStatus} {...props} />;

  if (itemStatus === 'READY') return <ReadyItemInfoSection itemStatus={itemStatus} {...props} />;

  return null;
}

export default ItemEditForm;
