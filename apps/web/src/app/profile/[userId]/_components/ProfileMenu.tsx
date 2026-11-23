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

type ProfileMenuProps = {
  nickname: string;
  isFriend: boolean;
  onDeleteFriend: () => void;
  onBlock: () => void;
  onReport: () => void;
};

function ProfileMenu({ nickname, isFriend, onDeleteFriend, onBlock, onReport }: ProfileMenuProps) {
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
        {isFriend && (
          <DropdownMenuItem onSelect={handleSelect(onDeleteFriend)}>
            <TrashIconFill aria-hidden />
            친구 삭제하기
          </DropdownMenuItem>
        )}
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

export default ProfileMenu;
