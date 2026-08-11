'use client';

import { TrashIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
      {/** 설명이 없으면 Radix 가 참조할 요소도 없으므로 aria-describedby 를 비운다 */}
      <DialogContent
        showCloseButton={false}
        className="text-center"
        {...(!description && { 'aria-describedby': void 0 })}
      >
        <div className="flex justify-center">
          <TrashIconFill
            width={40}
            height={40}
            className="text-icon-neutral-secondary"
            aria-hidden
          />
        </div>
        <DialogHeader className="mt-5 gap-1">
          <DialogTitle className="heading-2-semibold text-text-neutral-primary">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="body-2-medium text-text-neutral-tertiary">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-5 flex-row gap-2.5">
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
