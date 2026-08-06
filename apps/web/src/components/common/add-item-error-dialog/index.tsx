'use client';

import ButtonLink from '@/components/button/ButtonLink';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/dialog';
import { cn } from '@/utils/cn';

import type { AddItemErrorTypeT } from './addItemErrorDialog.const';
import { ADD_ITEM_ERROR_CONTENT } from './addItemErrorDialog.const';

export type { AddItemErrorTypeT } from './addItemErrorDialog.const';

type AddItemErrorDialogProps = {
  type: AddItemErrorTypeT;
};

function AddItemErrorDialog({ type }: AddItemErrorDialogProps) {
  const { Icon, iconClassName, title, description, buttonText, buttonLink } =
    ADD_ITEM_ERROR_CONTENT[type];

  const handleBlockClose = (event: Event) => event.preventDefault();

  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center gap-5"
        onInteractOutside={handleBlockClose}
        onEscapeKeyDown={handleBlockClose}
      >
        <Icon className={cn('size-10', iconClassName)} aria-hidden />
        <div className="space-y-2 text-center">
          <DialogTitle className="heading-1-bold break-keep text-text-neutral-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="body-1-medium break-keep whitespace-pre-line text-text-neutral-tertiary">
            {description}
          </DialogDescription>
        </div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            <ButtonLink size="lg" href={buttonLink}>
              {buttonText}
            </ButtonLink>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemErrorDialog;
