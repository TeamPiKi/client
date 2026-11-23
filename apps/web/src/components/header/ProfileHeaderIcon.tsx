'use client';

import Link from 'next/link';

import { PersonIconFill, SettingsIconFill } from '@/assets/icons/fill';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { ROUTES } from '@/consts/route';

type ProfileHeaderIconProps = {
  onClick?: () => void;
  className?: string;
};

/**
 * 헤더 프로필 버튼 (내부 전용)
 *
 * @description 직접 import하지 말고 {@link HeaderIcon} `name="PROFILE"`을 사용할 것
 * @example
 * <Header right={<HeaderIcon name="PROFILE" />} />
 */
function ProfileHeaderIcon({ onClick, className }: ProfileHeaderIconProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="마이페이지" className={className}>
          <PersonIconFill className="size-6 text-icon-neutral-secondary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.MYPAGE}>
            <SettingsIconFill aria-hidden />
            설정
          </Link>
        </DropdownMenuItem>

        {/** TODO: 버튼 액션 정해지면 활성화 예정. 작동하지 않는 버튼 보이지 않게 하기 위해 주석처리 함 */}
        {/* <button type="button" className={profileMenuItemClassName}>
          <MessageIconFill className="size-6 shrink-0 text-icon-neutral-primary" aria-hidden />
          <span className="body-1-semibold text-text-neutral-primary">의견 보내기</span>
        </button> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileHeaderIcon;
