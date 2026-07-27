'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { ImageIconFill } from '@/assets/icons';
import { useImagePicker } from '@/hooks/useImagePicker';
import { cn } from '@/utils/cn';

type Props = {
  imageUrl: string | null;
  onImageSelect?: (file: File) => void;
  disabled?: boolean;
};

function ItemImageSection({ imageUrl, onImageSelect, disabled = false }: Props) {
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
      <ImageIconFill className="size-8 text-icon-neutral-secondary" />
      <span className="body-2-medium text-text-neutral-secondary underline underline-offset-3">
        이미지를 추가해주세요
      </span>
    </>
  );

  const containerClassName = cn(
    'relative mx-auto mt-8 block size-[200px] overflow-hidden rounded-xl bg-gray-100',
    !displayUrl && 'flex flex-col items-center justify-center gap-3'
  );

  if (disabled) return <div className={containerClassName}>{imageContent}</div>;

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        disabled={isPending}
        className={cn(containerClassName, 'cursor-pointer')}
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
