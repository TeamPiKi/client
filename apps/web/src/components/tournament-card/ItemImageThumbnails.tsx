import type { CSSProperties, ReactNode } from 'react';

import { ImageIconFill, LoaderIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

type Props = {
  /** 최대 2개까지만 사용됨 */
  imageUrls: string[];
};

function ItemImageThumbnails({ imageUrls }: Props) {
  const frontImageUrl = imageUrls[0];
  const backImageUrl = imageUrls[1];

  return (
    <div className="relative h-[72px] w-[85px] shrink-0">
      <div className="absolute top-0 left-[13px] flex size-[72px] items-center justify-center">
        <Thumbnail
          src={backImageUrl}
          className="origin-center scale-[0.918] rotate-10 opacity-60"
          style={{ zIndex: Z_INDEX.BASE_IMAGE - 1 }}
          fallback={<LoaderIconFill className="size-7 text-gray-600" aria-hidden />}
        />
      </div>
      <Thumbnail
        src={frontImageUrl}
        className="absolute top-1 left-0"
        style={{ zIndex: Z_INDEX.BASE_IMAGE }}
        fallback={<ImageIconFill className="size-[30px] text-gray-300" aria-hidden />}
      />
    </div>
  );
}

function Thumbnail({
  src,
  className,
  style,
  fallback,
}: {
  src?: string;
  className?: string;
  style?: CSSProperties;
  fallback: ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative size-[63px] overflow-hidden rounded-[16px] border-[3px] border-white bg-gray-50 shadow-[0_0_8px_rgba(0,0,0,0.16)]',
        className
      )}
      style={style}
    >
      {src ? (
        <BaseImage
          src={src}
          alt=""
          sizes="63px"
          className="object-cover"
          loadingFallback={<Skeleton className="absolute inset-0" />}
          errorFallback={
            <div className="flex size-full items-center justify-center">{fallback}</div>
          }
        />
      ) : (
        <div className="flex size-full items-center justify-center">{fallback}</div>
      )}
    </div>
  );
}

export default ItemImageThumbnails;
