'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import { useEffect, useState } from 'react';

import { CameraIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { useImagePicker } from '@/hooks/useImagePicker';
import type { UserIdentityTypeT } from '@/types/user';

type Props = {
  userIdentityType: UserIdentityTypeT;
  profileImage: string;
  onImageSelect?: (file: File) => void;
};

function ProfileImageField({ userIdentityType, profileImage, onImageSelect }: Props) {
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

  const displayUrl = previewUrl ?? profileImage;

  return (
    <>
      <div className="relative mx-auto size-[90px]">
        {userIdentityType === 'MEMBER' ? (
          <button
            type="button"
            onClick={openPicker}
            disabled={isPending}
            aria-label="프로필 이미지 변경"
            className="relative size-[90px] cursor-pointer"
          >
            <span className="relative block size-[90px] overflow-hidden rounded-full">
              <BaseImage
                src={displayUrl}
                alt="프로필 이미지"
                sizes="90px"
                className="object-cover"
                loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
              />
            </span>
            <span
              className="absolute top-[54.5px] left-[59px] flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-layer-default"
              style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
            >
              <CameraIconFill className="size-6 shrink-0 text-icon-neutral-secondary" />
            </span>
          </button>
        ) : (
          <div className="relative size-[90px] overflow-hidden rounded-full">
            <BaseImage
              src={displayUrl}
              alt="프로필 이미지"
              sizes="90px"
              className="object-cover"
              loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
            />
          </div>
        )}
      </div>

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

export default ProfileImageField;
