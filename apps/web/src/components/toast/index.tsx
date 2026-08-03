'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { AlertIconFill, CheckCircledIconFill, WarningIconFill } from '@/assets/icons/fill';

/**
 * 토스트 하단 offset 기본값.
 * Bottom Tab Bar 가 있는 페이지는 globals.css 의 `:has([data-bottom-tab-bar])` 규칙이 덮어쓴다.
 */
const TOAST_OFFSET = '52px';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      visibleToasts={1}
      duration={3000}
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CheckCircledIconFill className="size-6 text-icon-success" width={24} height={24} />
        ),
        info: <AlertIconFill className="size-6 text-gray-300" width={24} height={24} />,
        warning: <WarningIconFill className="size-6 text-icon-warning" width={24} height={24} />,
        error: <WarningIconFill className="size-6 text-red-300" width={24} height={24} />,
      }}
      style={
        {
          '--normal-bg': 'var(--color-gray-700)',
          '--normal-text': 'var(--color-text-neutral-inverse)',
          '--border-radius': 'var(--radius-xl)',
          '--width': 'min(440px, calc(100vw - 40px))',
          width: 'min(440px, calc(100vw - 40px))',
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        } as React.CSSProperties
      }
      position="bottom-center"
      offset={{ bottom: TOAST_OFFSET }}
      mobileOffset={{ left: 0, right: 0, bottom: TOAST_OFFSET }}
      toastOptions={{
        classNames: {
          toast: '!border-none',
          title: '!body-2-semibold',
          icon: '!size-6 !ml-0 !mr-0',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
