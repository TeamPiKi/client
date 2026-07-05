'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { AlertIconFill, CheckCircledIconFill, WarningIconFill } from '@/assets/icons/fill';

import { TOAST_OFFSET } from './toast.const';
import { useToastOffsetStore } from './useToastOffset';

const Toaster = ({ ...props }: ToasterProps) => {
  // 하단 고정 UI(탭바 등)가 등록한 override 중 가장 최근 값 사용
  const offset = useToastOffsetStore(
    state => state.overrides.at(-1)?.offset ?? TOAST_OFFSET.DEFAULT
  );

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
          // sonner 컨테이너 width 변수 — 토스트 카드 폭을 결정 (기본 356px)
          // 앱 max-w-120(480px)에서 좌우 20px 여백 제외한 값
          '--width': '440px',
        } as React.CSSProperties
      }
      position="bottom-center"
      // 데스크탑/모바일 동일하게 적용
      offset={{ bottom: offset }}
      mobileOffset={{ bottom: offset }}
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
