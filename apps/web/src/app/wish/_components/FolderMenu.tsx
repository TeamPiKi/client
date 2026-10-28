'use client';

import { useRef } from 'react';

import { FolderIconFill, ThreeDotVerticalIconFill, TrashIconFill } from '@/assets/icons';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/popover';

type FolderMenuProps = {
  folderName: string;
  onRename: () => void;
  onDelete: () => void;
};

const MENU_ITEM_CLASS_NAME =
  'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-3 body-2-medium text-text-neutral-primary hover:bg-bg-layer-basement focus-visible:bg-bg-layer-basement focus-visible:outline-none';

function FolderMenu({ folderName, onRename, onDelete }: FolderMenuProps) {
  const isItemSelectedRef = useRef(false);

  return (
    <Popover>
      <PopoverTrigger aria-label={`${folderName} 폴더 메뉴`}>
        <ThreeDotVerticalIconFill className="size-5 text-icon-neutral-primary" />
      </PopoverTrigger>
      {/** NOTE: 항목 선택으로 닫힐 때 트리거로 포커스를 되돌리면 이어 열리는 시트 입력창의 autoFocus 를 뺏음 */}
      <PopoverContent
        align="end"
        sideOffset={12}
        onCloseAutoFocus={event => {
          if (isItemSelectedRef.current) event.preventDefault();
          isItemSelectedRef.current = false;
        }}
        className="w-[191px] p-2 ring-0"
      >
        <PopoverClose
          className={MENU_ITEM_CLASS_NAME}
          onClick={() => {
            isItemSelectedRef.current = true;
            onRename();
          }}
        >
          <FolderIconFill className="size-6 text-icon-neutral-primary" />
          폴더명 변경하기
        </PopoverClose>
        <PopoverClose
          className={MENU_ITEM_CLASS_NAME}
          onClick={() => {
            isItemSelectedRef.current = true;
            onDelete();
          }}
        >
          <TrashIconFill className="size-6 text-icon-neutral-primary" />
          삭제하기
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

export default FolderMenu;
