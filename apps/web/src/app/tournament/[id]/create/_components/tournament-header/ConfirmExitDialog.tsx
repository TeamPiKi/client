'use client';

import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';

import ConfirmExitBasket from '../../_assets/confirm-exit-basket.svg';

type ConfirmExitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function ConfirmExitDialog({ open, onOpenChange, onConfirm }: ConfirmExitDialogProps) {
  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5 p-6">
        <ConfirmExitBasket
          className="text-text-neutral-secondary"
          width={30}
          height={29}
          aria-hidden
        />

        <div className="flex flex-col items-center gap-1">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            담기를 잠깐 멈출까요?
          </DialogTitle>
          <DialogDescription className="text-center body-2-medium text-text-neutral-tertiary">
            지금까지 담은 후보는
            <br />
            자동으로 저장돼 있어요.
          </DialogDescription>
        </div>

        <div className="flex w-full gap-2">
          <Button variant="secondary" size="lg" onClick={handleCancel}>
            계속 담기
          </Button>
          <Button variant="primary" size="lg" onClick={onConfirm}>
            나가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmExitDialog;
