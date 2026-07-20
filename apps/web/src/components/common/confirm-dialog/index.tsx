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

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
};

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isPending) return;
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="text-center">
        <div className="flex justify-center">
          <WarningIconFill width={48} height={48} className="text-red-300" aria-hidden />
        </div>
        <DialogHeader className="mt-4 gap-1">
          <DialogTitle className="heading-1">{title}</DialogTitle>
          {description && (
            <p className="body-1-medium text-text-neutral-tertiary">{description}</p>
          )}
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row gap-3">
          <DialogClose asChild>
            <Button variant="secondary" size="lg" className="flex-1" disabled={isPending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isPending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
