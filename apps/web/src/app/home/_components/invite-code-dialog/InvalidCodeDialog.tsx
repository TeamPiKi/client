'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import Spacing from '@/components/spacing';

import SadFace from '../../_assets/sad-face.svg';

type InvalidCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function InvalidCodeDialog({ open, onOpenChange }: InvalidCodeDialogProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center p-5">
        <SadFace className="size-7.75 text-icon-accent" aria-hidden />

        <Spacing size={12} />

        <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
          코드가 유효하지 않아요
        </DialogTitle>

        <Spacing size={8} />

        <DialogDescription className="text-center body-2-medium text-text-neutral-tertiary">
          입력한 코드와 일치하는 토너먼트가 없어요.
          <br />
          코드를 다시 확인해주세요.
        </DialogDescription>

        <Spacing size={16} />

        <button
          type="button"
          onClick={handleClose}
          className="flex h-13 w-full cursor-pointer items-center justify-center rounded-xl bg-bg-neutral-primary body-1-semibold text-text-neutral-inverse"
        >
          닫기
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default InvalidCodeDialog;
