'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { ImageIconFill } from '@/assets/icons';
import { useImagePicker } from '@/hooks/useImagePicker';
import type { ItemStatusT } from '@/types/item';
import { cn } from '@/utils/cn';

type Props = {
  itemStatus: ItemStatusT;
  imageUrl: string | null;
  onImageSelect?: (file: File) => void;
};

function ItemImageSection({ itemStatus, imageUrl, onImageSelect }: Props) {
  /** 사용자가 추가한 이미지 URL */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { openPicker, inputRef, handleInputChange, isPending } = useImagePicker({
    maxCount: 1,
    onSuccess: files => {
      const [file] = files;
      if (!file) return;

      setPreviewUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      onImageSelect?.(file);
    },
  });

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const displayUrl = previewUrl ?? imageUrl;

  const imageContent = displayUrl ? (
    <Image
      src={displayUrl}
      alt="상품 이미지"
      fill
      sizes="200px"
      className="object-cover"
      unoptimized={previewUrl !== null}
    />
  ) : (
    <>
      <ImageIconFill className="size-9 text-icon-neutral-secondary" />
      <span className="body-2-medium text-text-neutral-secondary underline underline-offset-2">
        이미지를 추가해주세요
      </span>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        disabled={isPending}
        className={cn(
          'relative mx-auto block aspect-square w-full max-w-[440px] cursor-pointer overflow-hidden rounded-xl bg-gray-50',
          !displayUrl && 'flex flex-col items-center justify-center gap-3',
          itemStatus === 'FAILED' ? 'mt-4' : 'mt-7'
        )}
      >
        {imageContent}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_IMAGE_MIME_TYPES.join(', ')}
        className="hidden"
        onChange={handleInputChange}
      />
    </>
  );
}

export default ItemImageSection;
