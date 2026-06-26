'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { type ButtonStyleProps, buttonStyles } from './button.style';

const Spinner = dynamic(() => import('@/components/spinner'), { ssr: false });

type ButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  ButtonStyleProps & {
    leadingIcon?: ReactNode;
    children?: ReactNode;
    isLoading?: boolean;
  };

function Button({
  variant,
  size,
  icon,
  leadingIcon,
  className,
  children,
  isLoading,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, icon }), className)}
      {...rest}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <Spinner size={24} />
      ) : (
        <>
          {icon === 'leading' && leadingIcon}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
