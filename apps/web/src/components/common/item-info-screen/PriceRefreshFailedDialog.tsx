'use client';

import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';

type PriceRefreshFailedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
};

/** 가격 정보 새로고침 실패 안내 — 직접 수정하기를 고르면 입력 폼으로 넘어간다 */
function PriceRefreshFailedDialog({ open, onOpenChange, onEdit }: PriceRefreshFailedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="pt-8 text-center">
        <DialogHeader className="gap-1">
          <DialogTitle className="heading-2-semibold text-text-neutral-primary">
            가격 정보를 불러오는 데 실패했어요
          </DialogTitle>
          <p className="body-2-medium text-text-neutral-tertiary">다시 시도해주세요</p>
        </DialogHeader>

        <DialogFooter className="mt-5 flex-row gap-2.5">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            확인
          </Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={onEdit}>
            직접 수정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PriceRefreshFailedDialog;
