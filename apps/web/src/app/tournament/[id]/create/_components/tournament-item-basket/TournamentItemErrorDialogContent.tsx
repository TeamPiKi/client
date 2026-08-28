'use client';

import { useRouter } from 'next/navigation';

import { WarningIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { ITEM_STATUS } from '@/consts/item';
import { ROUTES } from '@/consts/route';
import type { ItemStatusT } from '@/types/item';
import { cn } from '@/utils/cn';

import { useDeleteTournamentItem } from '../../../_common/_hooks/useDeleteTournamentItem';

const MODAL_CONTENT = {
  [ITEM_STATUS.FAILED]: {
    iconClassName: 'text-red-300',
    title: '상품 정보를 가져오지 못했어요',
    description: '서버에서 문제가 발생했어요',
  },
  [ITEM_STATUS.INCOMPLETE]: {
    iconClassName: 'text-icon-warning',
    title: '일부 정보만 찾았어요',
    description: '조금만 더 채우면 등록이 끝나요',
  },
};

type TournamentItemErrorDialogContentProps = {
  status: ItemStatusT<'FAILED' | 'INCOMPLETE'>;
  tournamentId: number;
  tournamentItemId: number;
};

/** FAILED·INCOMPLETE 아이템을 탭했을 때 띄우는 다이얼로그 본문 — 바스켓 타일을 트리거로 감싸서 쓴다 */
function TournamentItemErrorDialogContent({
  status,
  tournamentId,
  tournamentItemId,
}: TournamentItemErrorDialogContentProps) {
  const { iconClassName, title, description } = MODAL_CONTENT[status];

  const router = useRouter();
  const { deleteTournamentItemMutation, isDeleteTournamentItemPending } = useDeleteTournamentItem(
    tournamentId,
    tournamentItemId
  );

  /** 삭제되면 아이템과 함께 Dialog 도 언마운트되므로 따로 닫지 않는다 */
  const handleDeleteTournamentItem = () => deleteTournamentItemMutation();

  const handleEdit = () => router.push(ROUTES.TOURNAMENT_ITEM_EDIT(tournamentId, tournamentItemId));

  return (
    <DialogContent showCloseButton={false} className="gap-5 p-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <WarningIconFill className={cn('size-[30px]', iconClassName)} aria-hidden />
        <DialogHeader className="gap-1">
          <DialogTitle className="heading-2-semibold">{title}</DialogTitle>
          <p className="body-2-medium text-text-neutral-tertiary">{description}</p>
        </DialogHeader>
      </div>
      <DialogFooter className="flex-row gap-2.5">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          isLoading={isDeleteTournamentItemPending}
          onClick={handleDeleteTournamentItem}
        >
          삭제하기
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleEdit}>
          직접 입력하기
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default TournamentItemErrorDialogContent;
