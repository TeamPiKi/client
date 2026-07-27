'use client';

import ConfirmDialog from '@/components/common/confirm-dialog';
import { useDeleteTournament } from '@/hooks/useDeleteTournament';

type TournamentDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: number;
};

function TournamentDeleteDialog({ open, onOpenChange, tournamentId }: TournamentDeleteDialogProps) {
  const { deleteTournamentMutation, isDeleteTournamentPending } = useDeleteTournament(tournamentId);

  const handleConfirm = () => {
    if (isDeleteTournamentPending) return;
    deleteTournamentMutation(void 0, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="토너먼트를 삭제할까요?"
      description="삭제 후에는 다시 복구할 수 없어요."
      confirmLabel="삭제하기"
      cancelLabel="취소하기"
      isPending={isDeleteTournamentPending}
      onConfirm={handleConfirm}
    />
  );
}

export default TournamentDeleteDialog;
