'use client';

import { FolderIconFill, ThreeDotVerticalIconFill, TrashIconFill } from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

type FolderMenuProps = {
  folderName: string;
  onRename: () => void;
  onDelete: () => void;
};

function FolderMenu({ folderName, onRename, onDelete }: FolderMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`${folderName} 폴더 메뉴`}>
        <ThreeDotVerticalIconFill className="size-5 text-icon-neutral-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12}>
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
