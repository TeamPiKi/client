'use client';

import { WarningIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { useDeleteTournament } from '@/hooks/useDeleteTournament';

type TournamentDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: number;
};

function TournamentDeleteDialog({ open, onOpenChange, tournamentId }: TournamentDeleteDialogProps) {
  const { deleteTournamentMutation, isDeleteTournamentPending } = useDeleteTournament(tournamentId);

  const handleDeleteTournament = () => {
    if (isDeleteTournamentPending) return;

    deleteTournamentMutation(void 0, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isDeleteTournamentPending) return;

    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="text-center">
        <div className="flex justify-center">
          <div style={{ width: 48, height: 48 }}>
            <WarningIconFill width="100%" height="100%" className="text-red-300" aria-hidden />
          </div>
        </div>
        <DialogHeader className="mt-4 gap-1">
          <DialogTitle className="heading-1-bold">토너먼트를 삭제할까요?</DialogTitle>
          <p className="body-1-medium text-text-neutral-tertiary">
            삭제 후에는 다시 복구할 수 없어요.
          </p>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row gap-3">
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={isDeleteTournamentPending}
            >
              취소하기
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isDeleteTournamentPending}
            onClick={handleDeleteTournament}
          >
            삭제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TournamentDeleteDialog;
