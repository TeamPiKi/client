'use client';

import { useRef } from 'react';

import { BlockIconFill, EmergencyIconFill, ThreeDotVerticalIconFill } from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

type BlockedUserMenuProps = {
  nickname: string;
  onUnblock: () => void;
  onReport: () => void;
};

function BlockedUserMenu({ nickname, onUnblock, onReport }: BlockedUserMenuProps) {
  const isItemSelectedRef = useRef(false);

  const handleSelect = (callback: () => void) => () => {
    isItemSelectedRef.current = true;
    callback();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`${nickname} 메뉴`}>
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
        <DropdownMenuItem onSelect={handleSelect(onUnblock)}>
          <BlockIconFill aria-hidden />
          차단해제
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSelect(onReport)}>
          <EmergencyIconFill aria-hidden />
          신고하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BlockedUserMenu;
