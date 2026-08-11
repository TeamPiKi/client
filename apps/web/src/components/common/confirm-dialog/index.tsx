'use client';

import type { ReactNode } from 'react';

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
import { cn } from '@/utils/cn';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  icon?: ReactNode;
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
  icon = <WarningIconFill width={48} height={48} className="text-red-300" aria-hidden />,
  onConfirm,
}: ConfirmDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isPending) return;
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className={cn('text-center', !icon && 'pt-9')}>
        {icon && <div className="flex justify-center">{icon}</div>}
        <DialogHeader className={cn('gap-1', icon && 'mt-4')}>
          <DialogTitle className="heading-1-bold">{title}</DialogTitle>
          {description && <p className="body-1-medium text-text-neutral-tertiary">{description}</p>}
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
