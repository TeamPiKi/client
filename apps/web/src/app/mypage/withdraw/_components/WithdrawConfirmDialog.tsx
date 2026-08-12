'use client';

import { useState } from 'react';

import { WarningIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <BottomCta className="flex-row gap-3">
        <DialogClose asChild>
          <Button variant="secondary" size="lg" className="flex-1">
            더 써볼래요
          </Button>
        </DialogClose>
        <DialogTrigger asChild>
          <Button variant="primary" size="lg" className="flex-1">
            탈퇴하기
          </Button>
        </DialogTrigger>
      </BottomCta>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5 text-center">
        <WarningIconFill className="size-9 text-icon-neutral-secondary" aria-hidden />
        <div className="flex flex-col gap-1">
          <DialogTitle className="heading-1-bold text-text-neutral-primary">
            정말 탈퇴하시겠어요?
          </DialogTitle>
          <DialogDescription className="body-2-medium text-text-neutral-tertiary">
            지금까지의 토너먼트 기록, 위시 기록이 전부 사라져요.
          </DialogDescription>
        </div>
        <DialogFooter className="w-full flex-row gap-2.5">
          <DialogClose asChild>
            <Button variant="secondary" size="lg" className="flex-1">
              더 써볼래요
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isDeleteMePending}
            onClick={handleWithdraw}
          >
            떠날래요
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawConfirmDialog;
