'use client';

import { useRef } from 'react';

import {
  BlockIconFill,
  EmergencyIconFill,
  ThreeDotVerticalIconFill,
  TrashIconFill,
} from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

type FriendMenuProps = {
  nickname: string;
  /** trigger: 확인창을 닫은 뒤 포커스를 되돌릴 메뉴 버튼 */
  onDelete: (trigger: HTMLButtonElement | null) => void;
  onBlock: (trigger: HTMLButtonElement | null) => void;
  onReport: () => void;
};

function FriendMenu({ nickname, onDelete, onBlock, onReport }: FriendMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isItemSelectedRef = useRef(false);

  const handleSelect = (callback: (trigger: HTMLButtonElement | null) => void) => () => {
    isItemSelectedRef.current = true;
    callback(triggerRef.current);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger ref={triggerRef} aria-label={`${nickname} 메뉴`}>
        <ThreeDotVerticalIconFill className="size-6 text-icon-neutral-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        onCloseAutoFocus={event => {
          if (isItemSelectedRef.current) event.preventDefault();
          isItemSelectedRef.current = false;
        }}
      >
        <DropdownMenuItem onSelect={handleSelect(onDelete)}>
          <TrashIconFill aria-hidden />
          친구 삭제하기
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSelect(onBlock)}>
          <BlockIconFill aria-hidden />
          차단하기
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSelect(onReport)}>
          <EmergencyIconFill aria-hidden />
          신고하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FriendMenu;
