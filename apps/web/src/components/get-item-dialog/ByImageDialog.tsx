'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ImageIconFill } from '@/assets/icons';
import Button from '@/components/button';
import ImageCropEditor from '@/components/common/image-crop-editor';
import type {
  ImageCropEditorImageT,
  ImageCropResultT,
} from '@/components/common/image-crop-editor/imageCropEditor.types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { useImagePicker } from '@/hooks/useImagePicker';
import { usePostTournamentOCR } from '@/hooks/usePostTournamentOCR';
import { usePostWishOCR } from '@/hooks/usePostWishOCR';
import type { ItemTypeT } from '@/types/item';
import { loadImage } from '@/utils/cropImage';

import Spacing from '../spacing';

const MAX_IMAGE_COUNT = 5;
/** OCR 은 상품명·가격 글자가 읽혀야 하므로 프로필보다 크게 둔다 */
const CROP_OUTPUT_MAX_SIZE = 2048;

type PickedImageT = ImageCropEditorImageT & { file: File };

type PickedResultT = {
  images: PickedImageT[];
  skippedCount: number;
};

const revokePickedImages = (images: PickedImageT[]) =>
  images.forEach(image => URL.revokeObjectURL(image.src));

const toPickedImage = async (file: File): Promise<PickedImageT> => {
  const src = URL.createObjectURL(file);
  try {
    const { width, height } = await loadImage(src);
    return { id: crypto.randomUUID(), src, size: { width, height }, file };
  } catch {
    /** NOTE: 서버는 HEIC 를 받으므로 브라우저가 디코드 못 해도 거절하지 않고 원본 그대로 올림 */
    return { id: crypto.randomUUID(), src, size: null, file };
  }
};

type Props = {
  type: ItemTypeT;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ByImageDialog({ type, open, onOpenChange }: Props) {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { postWishOCRMutation, isPostWishOCRPending, resetPostWishOCRMutation } = usePostWishOCR();
  const { postTournamentOCRMutation, isPostTournamentOCRPending, resetPostTournamentOCRMutation } =
    usePostTournamentOCR(Number(tournamentId));

  /** 피커에서 고른 원본 — 값이 있으면 크롭 에디터가 열린다 */
  const [picked, setPicked] = useState<PickedResultT | null>(null);
  const isOpenRef = useRef(open);

  useEffect(() => {
    isOpenRef.current = open;
  }, [open]);

  const {
    openPicker,
    inputRef,
    handleInputChange,
    isPending: isImagePickerPending,
    resetImagePicker,
  } = useImagePicker({
    maxCount: MAX_IMAGE_COUNT,
    onSuccess: async (files, skippedCount) => {
      const images = await Promise.all(files.map(toPickedImage));
      /** NOTE: 디코드 중 다이얼로그가 닫혔으면 버림. 안 그러면 다시 열 때 이전 선택으로 에디터가 뜸 */
      if (!isOpenRef.current) {
        revokePickedImages(images);
        return;
      }
      setPicked({ images, skippedCount });
    },
  });

  useEffect(
    () => () => {
      if (picked) revokePickedImages(picked.images);
    },
    [picked]
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setPicked(null);
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (open) return;

    resetImagePicker();
    resetPostWishOCRMutation();
    resetPostTournamentOCRMutation();
  }, [open, resetImagePicker, resetPostTournamentOCRMutation, resetPostWishOCRMutation]);

  const handleCropConfirm = (results: ImageCropResultT[]) => {
    if (!picked) return;

    const files = picked.images.map(image => {
      const blob = results.find(result => result.id === image.id)?.blob;
      if (!blob) return image.file;
      return new File([blob], `${image.file.name.replace(/\.[^.]+$/, '')}.jpg`, {
        type: blob.type,
      });
    });

    const { skippedCount } = picked;
    const mutationOptions = {
      onSettled: () => handleOpenChange(false),
      onSuccess: () => {
        if (skippedCount > 0)
          toast.warning(`지원하지 않는 형식의 이미지 ${skippedCount}장은 제외됐어요.`);
      },
    };

    if (type === 'wish') postWishOCRMutation(files, mutationOptions);
    else if (type === 'tournament') postTournamentOCRMutation(files, mutationOptions);
  };

  const isOCRPending = isPostWishOCRPending || isPostTournamentOCRPending;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className="flex flex-col gap-4 rounded-3xl">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            이미지로 담기
          </DialogTitle>

          <DialogDescription className="sr-only">
            상품 스크린샷 이미지를 선택해 담습니다. (최대 {MAX_IMAGE_COUNT}장까지 가져올 수 있어요.)
          </DialogDescription>

          <button
            type="button"
            onClick={openPicker}
            disabled={isImagePickerPending || isOCRPending}
            className="flex w-full cursor-pointer flex-col items-center rounded-xl border border-dashed border-border-neutral-muted bg-bg-layer-basement py-8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ImageIconFill className="size-6 text-icon-neutral-secondary" />

            <Spacing size={10} />

            <div className="body-1-bold text-text-neutral-secondary">상품명•가격이 보이는 사진</div>

            <Spacing size={4} />

            <p className="body-2-medium text-text-neutral-secondary">
              최대 {MAX_IMAGE_COUNT}장까지 가져올 수 있어요.
            </p>
          </button>

          <Button
            size="lg"
            variant="primary"
            isLoading={isImagePickerPending || isOCRPending}
            onClick={openPicker}
          >
            사진 선택하기
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept={SUPPORTED_IMAGE_MIME_TYPES.join(', ')}
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
        </DialogContent>
      </Dialog>

      {open && picked && (
        <ImageCropEditor
          title="이미지 편집"
          images={picked.images}
          outputMaxSize={CROP_OUTPUT_MAX_SIZE}
          isPending={isOCRPending}
          onCancel={() => setPicked(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}

export default ByImageDialog;
