'use client';

import { useRouter } from 'next/navigation';

import { WarningIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { ROUTES } from '@/consts/route';

import { useDeleteTournamentItem } from '../../../_common/_hooks/useDeleteTournamentItem';

type TournamentItemFailedModalProps = {
  open: boolean;
  tournamentId: number;
  tournamentItemId: number;
  onClose: () => void;
};

function TournamentItemFailedModal({
  open,
  tournamentId,
  tournamentItemId,
  onClose,
}: TournamentItemFailedModalProps) {
  const router = useRouter();
  const { deleteTournamentItemMutation, isDeleteTournamentItemPending } = useDeleteTournamentItem(
    tournamentId,
    tournamentItemId
  );

  const handleDeleteTournamentItem = () => {
    deleteTournamentItemMutation(void 0, {
      onSettled: () => onClose(),
    });
  };

  const handleEdit = () => {
    onClose();
    router.push(ROUTES.TOURNAMENT_ITEM_EDIT(tournamentId, tournamentItemId));
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent showCloseButton={false} className="text-center">
        <div className="flex justify-center">
          <div style={{ width: 48, height: 48 }}>
            <WarningIconFill width="100%" height="100%" className="text-red-300" aria-hidden />
          </div>
        </div>
        <DialogHeader className="mt-4 gap-1">
          <DialogTitle className="heading-1-bold">상품 정보를 가져오지 못했어요</DialogTitle>
          <p className="body-1-medium text-text-neutral-tertiary">서버에서 문제가 발생했어요</p>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row gap-3">
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
    </Dialog>
  );
}

export default TournamentItemFailedModal;
