'use client';

import { usePathname } from 'next/navigation';

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
import { cn } from '@/utils/cn';

import type { JoinErrorTypeT } from './joinErrorDialog.const';
import { JOIN_ERROR_CONTENT } from './joinErrorDialog.const';

export type { JoinErrorTypeT } from './joinErrorDialog.const';

type JoinErrorDialogProps = {
  type: JoinErrorTypeT;
  open?: boolean;
  /** 생략 시 esc 키, dim 클릭으로 다이얼로그 닫히지 않음 */
  onOpenChange?: (open: boolean) => void;
};

function JoinErrorDialog({ type, open = true, onOpenChange }: JoinErrorDialogProps) {
  const { Icon, iconClassName, title, description } = JOIN_ERROR_CONTENT[type];

  /** 합류 실패의 종착지는 항상 홈이다 — 이미 홈이면 이동할 곳이 없으므로 닫기만 한다 */
  const isAlreadyHome = usePathname() === ROUTES.HOME;

  const handleBlockClose = (event: Event) => {
    if (!onOpenChange) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {isAlreadyHome ? (
              <Button size="lg">확인</Button>
            ) : (
              <ButtonLink size="lg" href={ROUTES.HOME}>
                홈으로 가기
              </ButtonLink>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default JoinErrorDialog;
