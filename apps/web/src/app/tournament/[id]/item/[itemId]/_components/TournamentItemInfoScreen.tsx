'use client';

import ItemInfoScreen from '@/components/common/item-info-screen';
import ItemLinkBanner from '@/components/common/item-info-screen/ItemLinkBanner';
import { Header, HeaderIcon } from '@/components/header';

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
    <div className="hide-scrollbar min-h-dvh overflow-y-auto bg-bg-layer-basement px-5 pt-padding-top pb-[78px]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="위시 정보 확인"
        centerClassName="heading-1-bold"
      />
      <main>
        <ItemInfoScreen
          itemStatus={tournamentItemData.status}
          initialImageUrl={tournamentItemData.imageUrl ?? null}
          initialName={tournamentItemData.name ?? ''}
          initialPrice={tournamentItemData.price ?? 0}
          onSave={data => patchTournamentItemMutation(data)}
          isSavePending={isPatchTournamentItemPending}
          onDelete={() => deleteTournamentItemMutation()}
          isDeletePending={isDeleteTournamentItemPending}
        />

        {tournamentItemData.status === 'READY' && tournamentItemData.sourceUrl && (
          <ItemLinkBanner href={tournamentItemData.sourceUrl} />
        )}
      </main>
    </div>
  );
}

export default TournamentItemInfoScreen;
