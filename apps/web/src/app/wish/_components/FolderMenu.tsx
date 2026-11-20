'use client';

import { useRef } from 'react';

import {
  FolderIconFill,
  LockIconFill,
  ThreeDotVerticalIconFill,
  TrashIconFill,
  UnlockIconFill,
} from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

type FolderMenuProps = {
  folderName: string;
  isPublic: boolean;
  onToggleVisibility: () => void;
  onRename: () => void;
  onDelete: () => void;
};

function FolderMenu({
  folderName,
  isPublic,
  onToggleVisibility,
  onRename,
  onDelete,
}: FolderMenuProps) {
  const isItemSelectedRef = useRef(false);

  const handleSelect = (callback: () => void) => () => {
    isItemSelectedRef.current = true;
    callback();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`${folderName} 폴더 메뉴`}>
        <ThreeDotVerticalIconFill className="size-5 text-icon-neutral-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        onCloseAutoFocus={event => {
          if (isItemSelectedRef.current) event.preventDefault();
          isItemSelectedRef.current = false;
        }}
      >
        {isPublic ? (
          <DropdownMenuItem onSelect={handleSelect(onToggleVisibility)}>
            <LockIconFill aria-hidden />
            비공개로 전환
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleSelect(onToggleVisibility)}>
            <UnlockIconFill aria-hidden />
            공개로 전환
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={handleSelect(onRename)}>
          <FolderIconFill aria-hidden />
          폴더명 변경하기
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSelect(onDelete)}>
          <TrashIconFill aria-hidden />
          삭제하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FolderMenu;
