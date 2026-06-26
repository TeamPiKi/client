import type React from 'react';

import { cn } from '@/utils/cn';

import AlarmHeaderIcon from './AlarmHeaderIcon';
import BackHeaderIcon from './BackHeaderIcon';
import ProfileHeaderIcon from './ProfileHeaderIcon';

type Props = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;

  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;

  className?: string;
};

/**
 * 공통 헤더
 *
 * @example
 * <Header
 *   left={<HeaderIcon name="BACK" />}
 *   right={
 *     <>
 *       <HeaderIcon name="PROFILE" />
 *       <HeaderIcon name="ALARM" />
 *     </>
 *   }
 * />
 */

function Header({
  left,
  center,
  right,
  leftClassName,
  centerClassName,
  rightClassName,
  className,
}: Props) {
  return (
    <header
      className={cn('relative flex h-7.5 w-full shrink-0 items-center justify-between', className)}
    >
      <div className={cn('inline-flex h-full items-center', leftClassName)}>{left}</div>
      <div
        className={cn(
          'absolute top-1/2 left-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 items-center justify-center',
          centerClassName
        )}
      >
        {center}
      </div>
      <div className={cn('inline-flex h-full items-center justify-end gap-3', rightClassName)}>
        {right}
      </div>
    </header>
  );
}

function HeaderIcon({
  name,
  className,
  onClick,
}: {
  name: 'PROFILE' | 'ALARM' | 'BACK';
  className?: string;
  onClick?: () => void;
}) {
  switch (name) {
    case 'PROFILE':
      return (
        <ProfileHeaderIcon onClick={onClick} className={cn('cursor-pointer p-[3px]', className)} />
      );
    case 'ALARM':
      return <AlarmHeaderIcon className={className} onClick={onClick} />;
    case 'BACK':
      return <BackHeaderIcon onClick={onClick} className={cn('cursor-pointer', className)} />;
    default:
      return null;
  }
}

export { Header, HeaderIcon };
