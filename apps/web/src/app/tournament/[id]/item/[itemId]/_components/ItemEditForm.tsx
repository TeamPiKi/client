'use client';

import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Input from '@/components/input';
import Spacing from '@/components/spacing';
import type { ItemStatusT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';

import { useDeleteTournamentItem } from '../../../_common/_hooks/useDeleteTournamentItem';
import { usePatchTournamentItem } from '../_hooks/usePatchTournamentItem';
import ItemImageSection from './ItemImageSection';

type ItemEditFormProps = {
  tournamentId: number;
  tournamentItemId: number;
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
};

const parsePriceToNumber = (raw: string): number => {
  const digits = raw.replace(/[^\d]/g, '');
  return digits.length === 0 ? 0 : Number(digits);
};

function ItemEditForm({
  tournamentId,
  tournamentItemId,
  itemStatus,
  initialImageUrl,
  initialName,
  initialPrice,
}: ItemEditFormProps) {
  const initialPriceFormatted = initialPrice ? formatPrice(String(initialPrice)) : '';

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPriceFormatted);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { patchTournamentItemMutation, isPatchTournamentItemPending } = usePatchTournamentItem(
    tournamentId,
    tournamentItemId
  );
  const { deleteTournamentItemMutation, isDeleteTournamentItemPending } = useDeleteTournamentItem(
    tournamentId,
    tournamentItemId
  );

  const trimmedName = name.trim();
  const parsedPrice = parsePriceToNumber(price);

  const isValid = trimmedName.length > 0 && parsedPrice > 0 && selectedImage !== null;

  const handleSave = () => {
    const isChanged =
      trimmedName !== initialName.trim() ||
      formatPrice(price) !== initialPriceFormatted ||
      selectedImage !== null;
    if (!isChanged || isPatchTournamentItemPending || !selectedImage) return;

    patchTournamentItemMutation({
      name: trimmedName,
      currentPrice: parsedPrice,
      image: selectedImage,
    });
  };

  const handleDelete = () => {
    if (isDeleteTournamentItemPending) return;

    deleteTournamentItemMutation();
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

      {itemStatus === 'FAILED' && (
        <BottomCta>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            isLoading={isDeleteTournamentItemPending}
            onClick={handleDelete}
          >
            삭제하기
          </Button>
          <Button
            variant="primary"
            size="lg"
            isLoading={isPatchTournamentItemPending}
            disabled={isDeleteTournamentItemPending || !isValid}
            className="flex-1"
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
