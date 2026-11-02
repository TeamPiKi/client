import { InboxIconFill } from '@/assets/icons';
import Button from '@/components/button';
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
  onBack: () => void;
};

function NoWishDialog({ onBack }: NoWishDialogProps) {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        closeOnDimClick={false}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex flex-col items-center gap-3">
          <InboxIconFill className="size-10 text-icon-neutral-secondary" />
          <div className="flex flex-col items-center gap-1 text-center">
            <DialogTitle className="heading-2-semibold break-keep text-text-neutral-primary">
              가져올 위시가 없어요.
            </DialogTitle>
            <DialogDescription className="body-2-medium break-keep text-text-neutral-tertiary">
              위시를 먼저 추가해 주세요.
            </DialogDescription>
          </div>
        </div>
        <DialogFooter className="flex w-full gap-2.5">
          <Button variant="secondary" size="lg" onClick={onBack}>
            돌아가기
          </Button>
          <DialogClose asChild>
            <ButtonLink size="lg" href={ROUTES.WISHLIST}>
              위시 담기
            </ButtonLink>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NoWishDialog;
