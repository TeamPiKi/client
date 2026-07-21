'use client';

import { AlertIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';

type ByeWarningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "상품 더 담기" — 모달 닫기만 (사용자가 후보를 더 추가하러 돌아감) */
  onAddMore: () => void;
  /** "시작하기" — 부전승 포함된 채로 토너먼트 시작 진행 */
  onConfirm: () => void;
};

/**
 * 후보 개수가 2의 거듭제곱(2, 4, 8, 16, 32) 이 아닐 때 시작 직전에 노출되는 안내 모달.
 * 일부 후보가 자동으로 다음 라운드에 올라가는 부전승이 발생함을 사용자에게 알린다.
 */
function ByeWarningDialog({ open, onOpenChange, onAddMore, onConfirm }: ByeWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-3 p-5">
        <AlertIconFill className="size-10 text-icon-accent" aria-hidden />

        <div className="flex flex-col items-center gap-2">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            부전승이 포함돼요
          </DialogTitle>
          <DialogDescription className="text-center body-1-medium text-text-neutral-tertiary">
            상품 수가 2, 4, 8, 16, 32개가 아니면
            <br />
            일부 상품은 자동으로 다음 라운드에 올라가요.
          </DialogDescription>
        </div>

        <div className="mt-1 flex w-full gap-2">
          <Button variant="secondary" size="lg" onClick={onAddMore}>
            상품 더 담기
          </Button>
          <Button variant="primary" size="lg" onClick={onConfirm}>
            시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ByeWarningDialog;
