'use client';

import ItemEditFormBase from '@/components/common/item-edit-form';
import type { ItemStatusT } from '@/types/item';

import { useDeleteTournamentItem } from '../../../_common/_hooks/useDeleteTournamentItem';
import { usePatchTournamentItem } from '../_hooks/usePatchTournamentItem';

type ItemEditFormProps = {
  tournamentId: number;
  tournamentItemId: number;
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
};

function ItemEditForm({
  tournamentId,
  tournamentItemId,
  itemStatus,
  initialImageUrl,
  initialName,
  initialPrice,
}: ItemEditFormProps) {
  const { patchTournamentItemMutation, isPatchTournamentItemPending } = usePatchTournamentItem(
    tournamentId,
    tournamentItemId
  );
  const { deleteTournamentItemMutation, isDeleteTournamentItemPending } = useDeleteTournamentItem(
    tournamentId,
    tournamentItemId
  );

  return (
    <ItemEditFormBase
      itemStatus={itemStatus}
      initialImageUrl={initialImageUrl}
      initialName={initialName}
      initialPrice={initialPrice}
      onSave={data => patchTournamentItemMutation(data)}
      isSavePending={isPatchTournamentItemPending}
      onDelete={() => deleteTournamentItemMutation()}
      isDeletePending={isDeleteTournamentItemPending}
    />
  );
}

export default ItemEditForm;
