'use client';

import { Drawer, DrawerContent, DrawerDescription } from '@/components/drawer';

import FolderNameForm from '../_common/_components/FolderNameForm';

type FolderNameSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialName?: string;
  onSubmit: (name: string) => void;
};

function FolderNameSheet({
  open,
  onOpenChange,
  title,
  initialName,
  onSubmit,
}: FolderNameSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerDescription className="sr-only">폴더 이름을 입력하세요.</DrawerDescription>
        <FolderNameForm
          title={title}
          {...(initialName && { initialName })}
          onBack={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default FolderNameSheet;
