'use client';

import { useState } from 'react';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Input from '@/components/input';
import Spacing from '@/components/spacing';
import type { ItemStatusT, PatchItemRequestT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';
import parsePriceToNumber from '@/utils/parsePriceToNumber';

import ItemImageSection from '../item-image-section';

type ItemEditFormProps = {
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
  onSave?: (data: PatchItemRequestT) => void;
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
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice ? formatPrice(String(initialPrice)) : '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const trimmedName = name.trim();
  const parsedPrice = parsePriceToNumber(price);

  const isActionPending = isSavePending || isDeletePending || isRefreshPending;

  const isNameChanged = trimmedName !== initialName.trim();
  const isPriceChanged = parsedPrice !== initialPrice;

  const hasImage = initialImageUrl !== null || selectedImage !== null;
  const isChanged = isNameChanged || isPriceChanged || selectedImage !== null;
  /**
   * 저장 가능한 경우
   * - READY: 이미지, 상품명, 가격 필드 중 일부 수정 가능. 생략은 불가
   * - FAILED: 이미지, 상품명, 가격 필드가 모두 추가되어야 함
   */
  const isSavable = isChanged && hasImage && trimmedName.length > 0 && parsedPrice > 0;

  /** 폼은 name·price 를 항상 검증하되, 전송은 실제로 바뀐 필드만 한다 */
  const handleSave = () => {
    onSave?.({
      ...(isNameChanged && { name: trimmedName }),
      ...(isPriceChanged && { price: parsedPrice }),
      ...(selectedImage && { image: selectedImage }),
    });
  };

  return (
    <>
      <ItemImageSection imageUrl={initialImageUrl} onImageSelect={setSelectedImage} />

      <Spacing size={24} />

      <div className="flex flex-col gap-5">
        <Input
          label="상품명"
          value={name}
          placeholder="상품명을 입력해주세요."
          onChange={event => setName(event.target.value)}
          maxLength={50}
          autoCorrect="off"
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
        />
      </div>

      <BottomCta>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          isLoading={isDeletePending}
          disabled={isActionPending}
          onClick={onDelete}
        >
          삭제하기
        </Button>

        {/** 정보 갱신은 READY만 가능 */}
        {itemStatus === 'READY' && !!onRefresh && (
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isRefreshPending}
            disabled={isActionPending}
            onClick={onRefresh}
          >
            다시 불러오기
          </Button>
        )}

        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          isLoading={isSavePending}
          disabled={isActionPending || !isSavable}
          onClick={handleSave}
        >
          저장하기
        </Button>
      </BottomCta>
    </>
  );
}

export default ItemEditForm;
