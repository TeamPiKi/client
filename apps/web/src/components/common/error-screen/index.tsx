import type { FC, ReactNode, SVGProps } from 'react';

import { cn } from '@/utils/cn';

type ErrorScreenProps = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  title: string;
  description?: string;
  /** 하단 액션 버튼 영역*/
  children?: ReactNode;
};

/**
 * 에러·빈 상태 전면 안내 화면.
 *
 * - 상호작용을 `children` 으로 넘겨받아 `'use client'` 없이 유지한다
 * - RSC(`not-found.tsx`)와 클라이언트 에러 바운더리(`error.tsx`)가 같은 레이아웃을 공유하기 위함
 *
 * NOTE: `global-error.tsx` 는 루트 레이아웃이 깨진 상황의 최후 방어선이라 의도적으로 이 컴포넌트를 쓰지 않는다.
 */
function ErrorScreen({ Icon, iconClassName, title, description, children }: ErrorScreenProps) {
  return (
    <div className="h-full bg-bg-layer-basement pt-padding-top">
      <div className="flex flex-col items-center gap-[30px] pt-[calc(253px_-_env(safe-area-inset-top))]">
        <div className="flex flex-col items-center gap-[25px]">
          <Icon className={cn('size-15', iconClassName)} aria-hidden />
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-1-semibold text-text-neutral-primary">{title}</h1>
            {description && (
              <p className="text-center body-1-medium break-keep text-text-neutral-tertiary">
                {description}
              </p>
            )}
          </div>
        </div>
        {children && <div className="flex gap-3">{children}</div>}
      </div>
    </div>
  );
}

export default ErrorScreen;
