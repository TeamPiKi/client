'use client';

import { SandTimerIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';

type DepositClosedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "토너먼트 시작하기" — 시작 흐름 진입 */
  onStart: () => void;
  /** "이어서 담기" — 모달 닫기만 (사용자가 후보를 더 추가하러 돌아감) */
  onContinue: () => void;
  /** 담긴 후보 수 — "N강" 표시에 그대로 사용 */
  itemCount: number;
  /** 시작 mutation 진행 중 여부 — 빠른 연타로 인한 중복 호출을 막기 위해 버튼을 비활성한다. */
  isPending?: boolean;
};

/**
 * 담기 마감 시각이 지난 직후 주최자에게 노출되는 자동 안내 모달.
 * 시스템이 자동으로 담기를 종료했음을 알리고 토너먼트 시작을 유도하되,
 * 후보를 더 담고 싶은 경우 "이어서 담기" 로 모달을 닫고 화면에 머무를 수 있다.
 */
function DepositClosedDialog({
  open,
  onOpenChange,
  onStart,
  onContinue,
  itemCount,
  isPending = false,
}: DepositClosedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5 p-5">
        <SandTimerIconFill className="size-10 text-icon-accent" aria-hidden />

        <div className="flex flex-col items-center gap-2">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            담기 시간이 종료됐어요.
          </DialogTitle>
          <DialogDescription className="text-center body-1-medium text-text-neutral-tertiary">
            지금 바로 {itemCount}강 토너먼트를 시작해 보세요.
          </DialogDescription>
        </div>

        <div className="flex w-full gap-2">
          <Button variant="secondary" size="lg" onClick={onContinue} disabled={isPending}>
            이어서 담기
          </Button>
          <Button variant="primary" size="lg" onClick={onStart} disabled={isPending}>
            토너먼트 시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DepositClosedDialog;
