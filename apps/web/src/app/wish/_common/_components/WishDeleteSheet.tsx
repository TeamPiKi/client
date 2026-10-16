'use client';

import Button from '@/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/drawer';

type WishDeleteSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => void;
};

function WishDeleteSheet({ open, onOpenChange, selectedCount, onConfirm }: WishDeleteSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1.5">
          <DrawerTitle className="heading-2-semibold text-text-neutral-primary">
            상품을 삭제할까요?
          </DrawerTitle>
          <DrawerDescription className="body-2-medium text-text-neutral-tertiary">
            선택하신 상품 {selectedCount}개가 삭제됩니다.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex gap-2.5 pt-6.5 pb-1.5">
          <DrawerClose asChild>
            <Button variant="secondary" size="lg" className="flex-1">
              취소
            </Button>
          </DrawerClose>
          <Button variant="primary" size="lg" className="flex-1" onClick={onConfirm}>
            삭제하기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default WishDeleteSheet;
