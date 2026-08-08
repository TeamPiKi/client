'use client';

import ItemLinkBanner from '@/components/common/item-edit-form/ItemLinkBanner';
import { Header, HeaderIcon } from '@/components/header';
import { cn } from '@/utils/cn';

import { useGetTournamentItem } from '../_hooks/useGetTournamentItem';
import ItemEditForm from './ItemEditForm';

type EditContentProps = {
  tournamentId: number;
  tournamentItemId: number;
};

function EditContent({ tournamentId, tournamentItemId }: EditContentProps) {
  const { tournamentItemData } = useGetTournamentItem(tournamentId, tournamentItemId);

  return (
    <div
      className={cn(
        'hide-scrollbar min-h-dvh overflow-y-auto bg-bg-layer-basement px-5 pt-padding-top pb-[78px]'
      )}
    >
      <Header
        left={<HeaderIcon name="BACK" />}
        center="위시 정보 확인"
        centerClassName="heading-1-bold"
      />
      <main>
        <ItemEditForm
          tournamentId={tournamentId}
          tournamentItemId={tournamentItemId}
          itemStatus={tournamentItemData.status}
          initialImageUrl={tournamentItemData.imageUrl ?? null}
          initialName={tournamentItemData.name ?? ''}
          initialPrice={tournamentItemData.price ?? 0}
        />

        {tournamentItemData.status === 'READY' && tournamentItemData.sourceUrl && (
          <ItemLinkBanner href={tournamentItemData.sourceUrl} />
        )}
      </main>
    </div>
  );
}

export default EditContent;
