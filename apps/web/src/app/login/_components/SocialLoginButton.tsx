'use client';

import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

import Spinner from '@/components/spinner';
import { cn } from '@/utils/cn';

const socialButtonStyles = cva(
  'flex h-[54px] w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] disabled:opacity-50',
  {
    variants: {
      variant: {
        google: 'border border-border-neutral-muted bg-white',
        apple: 'bg-gray-950',
        kakao: 'bg-[#FEE500]',
      },
    },
  }
);

const labelStyles = cva('body-1-semibold', {
  variants: {
    variant: {
      google: 'text-text-neutral-primary',
      apple: 'text-text-neutral-inverse',
      kakao: 'text-text-neutral-primary',
    },
  },
});

const SPINNER_COLOR: Record<'google' | 'apple' | 'kakao', string> = {
  google: '#1a1a1a',
  apple: '#ffffff',
  kakao: '#1a1a1a',
};

type SocialLoginButtonProps = {
  variant: 'google' | 'apple' | 'kakao';
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

function SocialLoginButton({
  variant,
  icon,
  label,
  onClick,
  className,
  isLoading,
  disabled,
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={cn(socialButtonStyles({ variant }), className)}
    >
      {isLoading ? <Spinner size={20} color={SPINNER_COLOR[variant]} /> : icon}
      <span className={labelStyles({ variant })}>{label}</span>
    </button>
  );
}

export default SocialLoginButton;
