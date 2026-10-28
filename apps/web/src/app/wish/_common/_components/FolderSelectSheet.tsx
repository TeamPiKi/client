'use client';

import { useState } from 'react';

import { FolderAddIconFill } from '@/assets/icons';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import { Header } from '@/components/header';

import { getMockWishImageUrl } from '../_consts/wishMock';
import type { WishFolderT } from '../_types/wish';
import FolderListThumbnail from './FolderListThumbnail';
import FolderNameForm from './FolderNameForm';

type FolderSelectSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: WishFolderT[];
  onSelect: (folder: WishFolderT) => void;
  onAddFolder: (name: string) => void;
};

function FolderSelectSheet({
  open,
  onOpenChange,
  folders,
  onSelect,
  onAddFolder,
}: FolderSelectSheetProps) {
  const [isAddView, setIsAddView] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setIsAddView(false);
    onOpenChange(isOpen);
  };

  const handleAddSubmit = (name: string) => {
    onAddFolder(name);
    setIsAddView(false);
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
            onBack={() => setIsAddView(false)}
            onSubmit={handleAddSubmit}
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
                  onClick={() => setIsAddView(true)}
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
                    <FolderListThumbnail
                      url={folder.wishIds[0] ? getMockWishImageUrl(folder.wishIds[0]) : null}
                    />
                    <span className="flex min-w-0 items-center gap-[5px] body-1-medium">
                      <span className="truncate text-text-neutral-primary">{folder.name}</span>
                      <span className="shrink-0 text-text-neutral-tertiary">
                        ({folder.wishIds.length})
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
