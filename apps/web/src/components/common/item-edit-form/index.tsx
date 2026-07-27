'use client';

import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Input from '@/components/input';
import Spacing from '@/components/spacing';
import type { ItemStatusT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';
import parsePriceToNumber from '@/utils/parsePriceToNumber';

import ItemImageSection from '../item-image-section';

type ItemEditFormProps = {
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
  onSave?: (data: { name: string; currentPrice: number; image: File }) => void;
  isSavePending?: boolean;
  onDelete: () => void;
  isDeletePending?: boolean;
  onRefresh?: () => void;
  isRefreshPending?: boolean;
};

function ItemEditForm({
  itemStatus,
  initialImageUrl,
  initialName,
  initialPrice,
  onSave,
  isSavePending = false,
  onDelete,
  isDeletePending = false,
  onRefresh,
  isRefreshPending = false,
}: ItemEditFormProps) {
  const initialPriceFormatted = initialPrice ? formatPrice(String(initialPrice)) : '';

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPriceFormatted);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const isActionPending = isDeletePending || isRefreshPending || isSavePending;
  const trimmedName = name.trim();
  const parsedPrice = parsePriceToNumber(price);
  const isValid = trimmedName.length > 0 && parsedPrice > 0 && selectedImage !== null;

  const handleSave = () => {
    const isChanged =
      trimmedName !== initialName.trim() ||
      formatPrice(price) !== initialPriceFormatted ||
      selectedImage !== null;
    if (!isChanged || isActionPending || !selectedImage) return;

    onSave?.({ name: trimmedName, currentPrice: parsedPrice, image: selectedImage });
  };

  const handleDelete = () => {
    if (isActionPending) return;
    onDelete();
  };

  const handleRefresh = () => {
    if (isActionPending) return;
    onRefresh?.();
  };

  return (
    <>
      <ItemImageSection
        imageUrl={initialImageUrl}
        onImageSelect={setSelectedImage}
        disabled={itemStatus === 'READY'}
      />

      <Spacing size={24} />

      <div className="flex flex-col gap-5">
        <Input
          label="상품명"
          value={name}
          placeholder="상품명을 입력해주세요."
          onChange={event => setName(event.target.value)}
          maxLength={50}
          autoCorrect="off"
          disabled={itemStatus === 'READY'}
        />
        <Input
          label="가격"
          value={price}
          placeholder="가격을 입력해주세요."
          onChange={event => setPrice(formatPrice(event.target.value, { withSuffix: false }))}
          onFocus={() => setPrice(prev => formatPrice(prev, { withSuffix: false }))}
          onBlur={() => setPrice(prev => formatPrice(prev))}
          inputMode="numeric"
          autoCorrect="off"
          disabled={itemStatus === 'READY'}
        />
      </div>

      {itemStatus === 'READY' && onRefresh && (
        <BottomCta>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            isLoading={isDeletePending}
            disabled={isRefreshPending || isSavePending}
            onClick={handleDelete}
          >
            삭제하기
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isRefreshPending}
            disabled={isDeletePending || isSavePending}
            onClick={handleRefresh}
          >
            다시 불러오기
          </Button>
        </BottomCta>
      )}

      {itemStatus === 'FAILED' && (
        <BottomCta>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            isLoading={isDeletePending}
            disabled={isRefreshPending || isSavePending}
            onClick={handleDelete}
          >
            삭제하기
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isSavePending}
            disabled={isDeletePending || isRefreshPending || !isValid}
            onClick={handleSave}
          >
            저장하기
          </Button>
        </BottomCta>
      )}
    </>
  );
}

export default ItemEditForm;
