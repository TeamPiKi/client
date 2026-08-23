'use client';

import { AlertIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';

type ByeWarningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "상품 더 담기" — 모달 닫기만 (사용자가 후보를 더 추가하러 돌아감) */
  onAddMore: () => void;
  /** 확인 — 부전승 포함된 채로 토너먼트 시작 진행 */
  onConfirm: () => void;
  /** 참여자는 후보를 더 담을 수 없어 확인 버튼 하나만 노출한다 */
  isParticipant?: boolean;
};

/**
 * 후보 개수가 2의 거듭제곱(2, 4, 8, 16, 32) 이 아닐 때 시작 직전에 노출되는 안내 모달.
 * 일부 후보가 자동으로 다음 라운드에 올라가는 부전승이 발생함을 사용자에게 알린다.
 */
function ByeWarningDialog({
  open,
  onOpenChange,
  onAddMore,
  onConfirm,
  isParticipant = false,
}: ByeWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-83 flex-col items-center gap-5 p-4">
        <div className="flex flex-col items-center gap-3">
          <AlertIconFill className="size-10 text-icon-accent" aria-hidden />

          <div className="flex flex-col items-center gap-1">
            <DialogTitle className="text-center heading-2-semibold text-text-neutral-primary">
              부전승이 포함돼요
            </DialogTitle>
            <DialogDescription className="text-center body-2-medium text-text-neutral-tertiary">
              상품 수가 2, 4, 8, 16, 32개가 아니면
              <br />
              일부 상품은 자동으로 다음 라운드에 올라가요.
            </DialogDescription>
          </div>
        </div>

        {isParticipant ? (
          <Button variant="primary" size="lg" className="w-full" onClick={onConfirm}>
            확인하고 시작하기
          </Button>
        ) : (
          <div className="flex w-full gap-2.5">
            <Button variant="secondary" size="lg" onClick={onAddMore}>
              상품 더 담기
            </Button>
            <Button variant="primary" size="lg" onClick={onConfirm}>
              시작하기
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ByeWarningDialog;
