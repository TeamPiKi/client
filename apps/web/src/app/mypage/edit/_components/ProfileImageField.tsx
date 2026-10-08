'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CameraIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import ImageCropEditor from '@/components/common/image-crop-editor';
import type {
  ImageCropEditorImageT,
  ImageCropResultT,
} from '@/components/common/image-crop-editor/imageCropEditor.types';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { useImagePicker } from '@/hooks/useImagePicker';
import type { UserIdentityTypeT } from '@/types/user';
import { loadImage } from '@/utils/cropImage';

/** 프로필은 원형 90px 노출 — 원본이 커도 출력 한 변이 이 값을 넘지 않게 줄인다 */
const CROP_OUTPUT_MAX_SIZE = 1080;

type Props = {
  userIdentityType: UserIdentityTypeT;
  profileImage: string;
  onImageSelect?: (file: File) => void;
};

function ProfileImageField({ userIdentityType, profileImage, onImageSelect }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  /** 피커에서 고른 원본 — 값이 있으면 크롭 에디터가 열린다 */
  const [cropTarget, setCropTarget] = useState<ImageCropEditorImageT | null>(null);

  const { openPicker, inputRef, handleInputChange, isPending } = useImagePicker({
    maxCount: 1,
    onSuccess: async files => {
      const [file] = files;
      if (!file) return;

      const url = URL.createObjectURL(file);
      let size: ImageCropEditorImageT['size'];
      try {
        const { width, height } = await loadImage(url);
        size = { width, height };
      } catch {
        URL.revokeObjectURL(url);
        toast.error('지원하지 않는 이미지 형식이에요.');
        return;
      }

      setCropTarget(prev => {
        if (prev) URL.revokeObjectURL(prev.src);
        return { id: 'profile', src: url, size };
      });
    },
  });

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  useEffect(
    () => () => {
      if (cropTarget) URL.revokeObjectURL(cropTarget.src);
    },
    [cropTarget]
  );

  const closeCropEditor = () => {
    setCropTarget(prev => {
      if (prev) URL.revokeObjectURL(prev.src);
      return null;
    });
  };

  const handleCropConfirm = (results: ImageCropResultT[]) => {
    const blob = results[0]?.blob;
    if (!blob) return;

    setPreviewUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(blob);
    });
    onImageSelect?.(new File([blob], 'profile.jpg', { type: blob.type }));
    closeCropEditor();
  };

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

      {cropTarget && (
        <ImageCropEditor
          title="프로필 이미지 편집"
          images={[cropTarget]}
          aspect={1}
          cropShape="round"
          outputMaxSize={CROP_OUTPUT_MAX_SIZE}
          onCancel={closeCropEditor}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}

export default ProfileImageField;
