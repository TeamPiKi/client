'use client';

import { SadIconFill } from '@/assets/icons';
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

import { usePostLogout } from '../_hooks/usePostLogout';

function LogoutMenuItem() {
  const { postLogoutMutation, isPostLogoutPending } = usePostLogout();

  const handleLogout = () => {
    postLogoutMutation();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center px-2 py-5 body-1-semibold text-text-neutral-secondary"
        >
          로그아웃
        </button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="space-y-5 text-center">
        <DialogHeader className="flex flex-col items-center gap-2 py-2">
          <SadIconFill className="size-9 text-icon-neutral-secondary" />
          <DialogTitle className="heading-1-bold text-text-neutral-primary">
            로그아웃 하시겠어요?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2.5">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            isLoading={isPostLogoutPending}
            onClick={handleLogout}
          >
            로그아웃
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

export default LogoutMenuItem;
