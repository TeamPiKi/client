'use client';

import type { ImageProps } from 'next/image';
import type { ReactNode } from 'react';

import BaseImage from '@/components/base-image';
import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT } from '@/types/item';
import { cn } from '@/utils/cn';

import LgErrorFallback from './fallback/LgErrorFallback';
import LoadingFallback from './fallback/LoadingFallback';
import SmErrorFallback from './fallback/SmErrorFallback';
import type { SizeVariantT } from './productImage.const';
import { SIZE_STYLE } from './productImage.const';

type ProductImageProps = Omit<ImageProps, 'width' | 'height' | 'src'> & {
  src?: ImageProps['src'];
  /** 이미지 크기. lg: 200×200 / sm: 68×68 */
  size?: SizeVariantT;
  /** true면 부모 크기에 맞게 꽉 채움 (size prop 무시) */
  fill?: boolean;
  /** 파싱 상태. PENDING·PROCESSING이면 스피너, FAILED이면 경고 아이콘 표시 */
  parsingStatus?: ItemStatusT;
  /** 로딩 중 표시할 커스텀 UI */
  loadingFallback?: ReactNode;
  /** 에러 시 표시할 커스텀 UI */
  errorFallback?: ReactNode;
};

function ProductImage({
  size = 'lg',
  fill = false,
  parsingStatus,
  loadingFallback,
  errorFallback,
  className,
  onLoad,
  onError,
  ...imageProps
}: ProductImageProps) {
  const { dimension, radius, decoration } = SIZE_STYLE[size];
  const baseClass = cn('bg-gray-50', radius, decoration);

  const containerClass = fill
    ? cn('relative h-full w-full overflow-hidden', baseClass)
    : cn('relative overflow-hidden', baseClass);

  if (!imageProps.src) {
    return (
      <div
        className={containerClass}
        {...(!fill ? { style: { width: dimension, height: dimension } } : {})}
      >
        {(parsingStatus === ITEM_STATUS.PENDING || parsingStatus === ITEM_STATUS.PROCESSING) && (
          <LoadingFallback />
        )}
        {/* INCOMPLETE 는 이미지를 못 건진 경우라 FAILED 와 같은 빈 이미지 자리를 쓴다 (디자인 확인 전 임시) */}
        {(parsingStatus === ITEM_STATUS.FAILED || parsingStatus === ITEM_STATUS.INCOMPLETE) &&
          (size === 'lg' ? <LgErrorFallback radius={radius} /> : <SmErrorFallback />)}
      </div>
    );
  }

  return (
    <div
      className={containerClass}
      {...(!fill ? { style: { width: dimension, height: dimension } } : {})}
    >
      <BaseImage
        {...imageProps}
        src={imageProps.src}
        className={cn(fill && 'object-cover', className)}
        loadingFallback={<LoadingFallback>{loadingFallback}</LoadingFallback>}
        errorFallback={
          size === 'lg' ? (
            <LgErrorFallback radius={radius}>{errorFallback}</LgErrorFallback>
          ) : (
            (errorFallback ?? <SmErrorFallback />)
          )
        }
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}

export default ProductImage;
