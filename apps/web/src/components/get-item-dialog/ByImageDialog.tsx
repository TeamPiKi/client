'use client';

import { SUPPORTED_IMAGE_MIME_TYPES } from '@piki/core';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { ImageIconFill } from '@/assets/icons';
import Button from '@/components/button';
import AddItemErrorDialog from '@/components/common/add-item-error-dialog';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { useImagePicker } from '@/hooks/useImagePicker';
import { usePostTournamentOCR } from '@/hooks/usePostTournamentOCR';
import { usePostWishOCR } from '@/hooks/usePostWishOCR';
import type { ItemTypeT } from '@/types/item';

import Spacing from '../spacing';

const MAX_IMAGE_COUNT = 5;

type Props = {
  type: ItemTypeT;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ByImageDialog({ type, open, onOpenChange }: Props) {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { postWishOCRMutation, isPostWishOCRPending, resetPostWishOCRMutation } = usePostWishOCR();
  const {
    postTournamentOCRMutation,
    isPostTournamentOCRPending,
    resetPostTournamentOCRMutation,
    addItemErrorType,
  } = usePostTournamentOCR(Number(tournamentId));

  const {
    openPicker,
    inputRef,
    handleInputChange,
    isPending: isImagePickerPending,
    resetImagePicker,
  } = useImagePicker({
    maxCount: MAX_IMAGE_COUNT,
    onSuccess: async (files, skippedCount) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      if (type === 'wish') {
        postWishOCRMutation(formData, {
          onSettled: () => onOpenChange(false),
          onSuccess: () => {
            if (skippedCount > 0)
              toast.warning(`지원하지 않는 형식의 이미지 ${skippedCount}장은 제외됐어요.`);
          },
        });
      } else if (type === 'tournament') {
        postTournamentOCRMutation(formData, {
          onSettled: () => onOpenChange(false),
          onSuccess: () => {
            if (skippedCount > 0)
              toast.warning(`지원하지 않는 형식의 이미지 ${skippedCount}장은 제외됐어요.`);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (open || addItemErrorType) return;

    resetImagePicker();
    resetPostWishOCRMutation();
    resetPostTournamentOCRMutation();
  }, [
    open,
    addItemErrorType,
    resetImagePicker,
    resetPostTournamentOCRMutation,
    resetPostWishOCRMutation,
  ]);

  if (addItemErrorType) return <AddItemErrorDialog type={addItemErrorType} />;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          disabled={isImagePickerPending || isPostWishOCRPending || isPostTournamentOCRPending}
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
          isLoading={isImagePickerPending || isPostWishOCRPending || isPostTournamentOCRPending}
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
  );
}

export default ByImageDialog;
