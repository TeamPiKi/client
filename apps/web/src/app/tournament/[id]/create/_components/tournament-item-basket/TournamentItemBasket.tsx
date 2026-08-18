import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import AddIcon from '@/assets/icons/fill/add.svg';
import { Dialog, DialogTrigger } from '@/components/dialog';
import GetItemDialogContent from '@/components/get-item-dialog';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import type { TournamentPendingItemT } from '../../../_common/_types/tournamentResponse';
import basketImg from '../../_assets/basket-gray.png';
import { ITEMS_PER_BASKET } from '../../_consts/tournamentItemBasket';
import TournamentBasketItem from './TournamentBasketItem';
import TournamentItemFailedModal from './TournamentItemFailedDrawer';

type TournamentItemBasketProps = {
  basketIndex: number;
  items: TournamentPendingItemT[];
  maxHeight?: number;
  isDepositClosed?: boolean;
  participantImageMap?: Map<string, string>;
};

function TournamentItemBasket({
  basketIndex,
  items,
  maxHeight,
  isDepositClosed = false,
  participantImageMap,
}: TournamentItemBasketProps) {
  const { id } = useParams<{ id: string }>();
  const tournamentId = Number(id);
  const { userData } = useGetMe();
  const { tournamentData } = useGetTournament(tournamentId);

  const basketMaxWidth = maxHeight ? (maxHeight * 356) / 464 : null;

  const [failedItem, setFailedItem] = useState<TournamentPendingItemT | null>(null);

  const handleItemClick = (item: TournamentItemBasketProps['items'][number]) => {
    if (item.status === 'FAILED') setFailedItem(item);
  };

  const isFull = items.length >= ITEMS_PER_BASKET;
  const showAddButton = !isDepositClosed && !isFull;

  const addSlot = showAddButton ? (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-[1.85px] border-white bg-white/1 shadow-[0_0_8px_rgba(0,0,0,0.16)] backdrop-blur-sm"
          aria-label="위시 아이템 추가"
        >
          <AddIcon width={28} height={28} className="text-base-50" aria-hidden />
        </button>
      </DialogTrigger>
      <GetItemDialogContent type="tournament" />
    </Dialog>
  ) : null;

  return (
    <div
      className="relative mx-auto aspect-356/464 w-full max-w-full"
      {...(basketMaxWidth ? { style: { maxWidth: basketMaxWidth } } : {})}
    >
      <Image
        src={basketImg}
        alt={`장바구니 ${basketIndex + 1}`}
        fill
        sizes="(max-width: 480px) 100vw, 480px"
        className="object-contain"
      />
      <div className="absolute inset-0 flex items-start justify-center">
        {items.length === 0 && showAddButton ? (
          <div className="flex h-full w-[20%] items-center justify-start">{addSlot}</div>
        ) : (
          <div className="grid w-[45%] grid-cols-2 gap-x-6 gap-y-5 pt-[20%]">
            {addSlot}
            {items.map((item, index) => {
              /** READY 아이템은 누구나 진입 가능 — 주최자·본인이 아니면 조회 전용으로 열림 */
              if (item.status === 'READY') {
                return (
                  <Link
                    key={item.tournamentItemId}
                    href={ROUTES.TOURNAMENT_ITEM_EDIT(tournamentId, item.tournamentItemId)}
                  >
                    <TournamentBasketItem
                      item={item}
                      index={index}
                      participantImageMap={participantImageMap}
                    />
                  </Link>
                );
              }

              /** INCOMPLETE, FAILED 아이템 직접 입력은 주최자·본인만 가능 */
              const canEdit = tournamentData.isOwner || item.userId === userData.id;

              /** INCOMPLETE 아이템도 수정 페이지로 이동 */
              if (item.status === 'INCOMPLETE' && canEdit) {
                return (
                  <Link
                    key={item.tournamentItemId}
                    href={ROUTES.TOURNAMENT_ITEM_EDIT(tournamentId, item.tournamentItemId)}
                  >
                    <TournamentBasketItem
                      item={item}
                      index={index}
                      participantImageMap={participantImageMap}
                    />
                  </Link>
                );
              }

              return (
                <TournamentBasketItem
                  key={item.tournamentItemId}
                  item={item}
                  index={index}
                  {...(canEdit && { onClick: () => handleItemClick(item) })}
                  participantImageMap={participantImageMap}
                />
              );
            })}
          </div>
        )}
      </div>
      {failedItem && (
        <TournamentItemFailedModal
          open
          tournamentId={tournamentId}
          tournamentItemId={failedItem.tournamentItemId}
          onClose={() => setFailedItem(null)}
        />
      )}
    </div>
  );
}

export default TournamentItemBasket;
