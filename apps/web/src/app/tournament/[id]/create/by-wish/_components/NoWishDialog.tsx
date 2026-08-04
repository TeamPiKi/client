'use client';

import { SadIconFill } from '@/assets/icons';
import ButtonLink from '@/components/button/ButtonLink';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/dialog';
import { ROUTES } from '@/consts/route';

type NoWishDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function NoWishDialog({ open, onOpenChange }: NoWishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5">
        <SadIconFill className="size-10 text-icon-neutral-secondary" aria-hidden />
        <div className="space-y-2 text-center">
          <DialogTitle className="heading-1-bold break-keep text-text-neutral-primary">
            가져올 위시가 없어요.
          </DialogTitle>
          <DialogDescription className="body-1-medium break-keep text-text-neutral-tertiary">
            위시를 먼저 추가해주세요.
          </DialogDescription>
        </div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            <ButtonLink size="lg" href={ROUTES.WISHLIST}>
              위시 추가하기
            </ButtonLink>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NoWishDialog;
