'use client';

import ItemInfoScreen from '@/components/common/item-info-screen';
import { ITEM_STATUS } from '@/consts/item';

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

  /** READY 만 이미지·상품명·가격이 모두 채워져 있다 */
  const itemProps =
    tournamentItemData.status === ITEM_STATUS.READY
      ? {
          itemStatus: tournamentItemData.status,
          imageUrl: tournamentItemData.imageUrl,
          name: tournamentItemData.name,
          price: tournamentItemData.price,
        }
      : {
          itemStatus: tournamentItemData.status,
          imageUrl: null,
          name: '',
          price: 0,
        };

  return (
    <ItemInfoScreen
      {...itemProps}
      sourceUrl={tournamentItemData.sourceUrl}
      viewTitle="위시 정보 확인"
      deleteConfirmTitle="상품을 삭제할까요?"
      onSave={data => patchTournamentItemMutation(data)}
      isSavePending={isPatchTournamentItemPending}
      onDelete={() => deleteTournamentItemMutation()}
      isDeletePending={isDeleteTournamentItemPending}
    />
  );
}

export default TournamentItemInfoScreen;
