'use client';

import { useState } from 'react';

import { WarningIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';

import { useDeleteMe } from '../_hooks/useDeleteMe';

function WithdrawConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteMeMutation, isDeleteMePending } = useDeleteMe();

  const handleWithdraw = () => {
    if (isDeleteMePending) return;

    deleteMeMutation(void 0, {
      onError: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <BottomCta>
        <DialogTrigger asChild>
          <Button variant="secondary" size="lg" className="w-full">
            탈퇴하기
          </Button>
        </DialogTrigger>
      </BottomCta>
      <DialogContent showCloseButton={false} className="space-y-5">
        <DialogHeader className="flex flex-col items-center gap-2 py-2">
          <WarningIconFill className="size-9 text-icon-neutral-secondary" aria-hidden />
          <DialogTitle className="heading-1 text-text-neutral-primary">
            정말 탈퇴하시겠어요?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2.5">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            isLoading={isDeleteMePending}
            onClick={handleWithdraw}
          >
            탈퇴하기
          </Button>
          <DialogClose asChild>
            <Button variant="primary" size="lg" className="flex-1">
              유지하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawConfirmDialog;
