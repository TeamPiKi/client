'use client';

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`${folderName} 폴더 메뉴`}>
        <ThreeDotVerticalIconFill className="size-5 text-icon-neutral-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12}>
        {isPublic ? (
          <DropdownMenuItem onSelect={onToggleVisibility}>
            <LockIconFill aria-hidden />
            비공개로 전환
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={onToggleVisibility}>
            <UnlockIconFill aria-hidden />
            공개로 전환
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={onRename}>
          <FolderIconFill aria-hidden />
          폴더명 변경하기
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>
          <TrashIconFill aria-hidden />
          삭제하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FolderMenu;
