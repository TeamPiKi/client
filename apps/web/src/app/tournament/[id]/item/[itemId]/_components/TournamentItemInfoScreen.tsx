'use client';

import ItemInfoScreen from '@/components/common/item-info-screen';

import { useDeleteTournamentItem } from '../../../_common/_hooks/useDeleteTournamentItem';
import { useGetTournamentItem } from '../_hooks/useGetTournamentItem';
import { usePatchTournamentItem } from '../_hooks/usePatchTournamentItem';

type TournamentItemInfoScreenProps = {
  tournamentId: number;
  tournamentItemId: number;
};

function TournamentItemInfoScreen({
  tournamentId,
  tournamentItemId,
}: TournamentItemInfoScreenProps) {
  const { tournamentItemData } = useGetTournamentItem(tournamentId, tournamentItemId);
  const { patchTournamentItemMutation, isPatchTournamentItemPending } = usePatchTournamentItem(
    tournamentId,
    tournamentItemId
  );
  const { deleteTournamentItemMutation, isDeleteTournamentItemPending } = useDeleteTournamentItem(
    tournamentId,
    tournamentItemId
  );

  return (
    <ItemInfoScreen
      itemType="tournament"
      item={{
        status: tournamentItemData.status,
        imageUrl: tournamentItemData.imageUrl ?? null,
        name: tournamentItemData.name ?? '',
        price: tournamentItemData.price ?? 0,
        sourceUrl: tournamentItemData.sourceUrl ?? null,
      }}
      onSave={data => patchTournamentItemMutation(data)}
      isSavePending={isPatchTournamentItemPending}
      onDelete={() => deleteTournamentItemMutation()}
      isDeletePending={isDeleteTournamentItemPending}
      {...(tournamentItemData.memo && { memo: { value: tournamentItemData.memo } })}
    />
  );
}

export default TournamentItemInfoScreen;
