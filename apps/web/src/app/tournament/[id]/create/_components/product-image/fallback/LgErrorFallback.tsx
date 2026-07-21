import type { ReactNode } from 'react';

import PhotoIconFill from '@/assets/icons/fill/photo.svg';
import { cn } from '@/utils/cn';

type LgErrorFallbackProps = {
  radius: string;
  children?: ReactNode;
};

function LgErrorFallback({ radius, children }: LgErrorFallbackProps) {
  return (
    <div className={cn('absolute inset-0 flex items-center justify-center bg-gray-50', radius)}>
      {children ?? (
        <div className="flex flex-col items-center gap-3">
          <PhotoIconFill width={48} height={48} aria-hidden />
          <p className="heading-2-semibold text-gray-300">이미지가 비어 있어요</p>
          <button className="body-2-medium text-gray-600 underline underline-offset-2">
            직접 가져오기
          </button>
        </div>
      )}
    </div>
  );
}

export default LgErrorFallback;
