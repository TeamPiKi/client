'use client';

import { FolderAddIconFill } from '@/assets/icons';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import { Header } from '@/components/header';
import type { FolderT } from '@/types/folder';

import FolderListThumbnail from './FolderListThumbnail';
import FolderNameForm from './FolderNameForm';

type FolderSelectSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: FolderT[];
  isAddView: boolean;
  onAddViewChange: (isAddView: boolean) => void;
  addErrorMessage: string | null;
  isAddPending: boolean;
  onAddNameChange: () => void;
  onSelect: (folder: FolderT) => void;
  onAddFolder: (name: string) => void;
};

function FolderSelectSheet({
  open,
  onOpenChange,
  folders,
  isAddView,
  onAddViewChange,
  addErrorMessage,
  isAddPending,
  onAddNameChange,
  onSelect,
  onAddFolder,
}: FolderSelectSheetProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onAddViewChange(false);
    onOpenChange(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerDescription className="sr-only">
          {isAddView ? '새 폴더 이름을 입력하세요.' : '상품을 옮길 폴더를 선택하세요.'}
        </DrawerDescription>
        {isAddView ? (
          <FolderNameForm
            title="폴더 추가"
            submitErrorMessage={addErrorMessage}
            isPending={isAddPending}
            onBack={() => onAddViewChange(false)}
            onNameChange={onAddNameChange}
            onSubmit={onAddFolder}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Header
              center={
                <DrawerTitle className="heading-2-semibold text-text-neutral-primary">
                  폴더 선택
                </DrawerTitle>
              }
              right={
                <button
                  type="button"
                  aria-label="폴더 추가"
                  onClick={() => onAddViewChange(true)}
                  className="cursor-pointer"
                >
                  <FolderAddIconFill className="size-6 text-icon-neutral-primary" />
                </button>
              }
            />
            <ul className="flex max-h-[50dvh] flex-col overflow-y-auto">
              {folders.map(folder => (
                <li key={folder.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(folder)}
                    className="flex h-15 w-full cursor-pointer items-center gap-[13px] text-left"
                  >
                    <FolderListThumbnail url={folder.coverImageUrls[0] ?? null} />
                    <span className="flex min-w-0 items-center gap-[5px] body-1-medium">
                      <span className="truncate text-text-neutral-primary">{folder.name}</span>
                      <span className="shrink-0 text-text-neutral-tertiary">
                        ({folder.wishCount})
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default FolderSelectSheet;
