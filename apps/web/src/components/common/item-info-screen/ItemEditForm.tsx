'use client';

import { useState } from 'react';

import { WarningIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Input from '@/components/input';
import Spacing from '@/components/spacing';
import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT, PatchItemRequestT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';
import parsePriceToNumber from '@/utils/parsePriceToNumber';

import ItemImagePicker from './ItemImagePicker';
import type { ItemInfoT } from './itemInfoScreen.type';

type ItemEditFormProps = {
  item: ItemInfoT;
  onSave: (data: PatchItemRequestT) => void;
  isSavePending?: boolean;
};

/** 상태별 상단 안내 배너 문구 */
const EDIT_BANNER_MESSAGE: Partial<Record<ItemStatusT, string>> = {
  [ITEM_STATUS.FAILED]: '상품 정보를 가져오는데 실패했어요. 직접 입력해주세요.',
  [ITEM_STATUS.INCOMPLETE]: '일부 정보만 찾았어요. 조금만 더 채우면 등록이 끝나요.',
};

/**
 * 상품 정보를 직접 입력·수정하는 폼
 */
function ItemEditForm({ item, onSave, isSavePending = false }: ItemEditFormProps) {
  const initialName = item.name?.trim() ?? '';
  const initialPrice = item.price ?? 0;

  const [name, setName] = useState(item.name ?? '');
  const [price, setPrice] = useState(initialPrice ? formatPrice(String(initialPrice)) : '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const trimmedName = name.trim();
  const parsedPrice = parsePriceToNumber(price);

  const isNameChanged = trimmedName !== initialName;
  const isPriceChanged = parsedPrice !== initialPrice;

  const hasImage = item.imageUrl !== null || selectedImage !== null;
  const isChanged = isNameChanged || isPriceChanged || selectedImage !== null;
  /**
   * 저장하기 버튼 활성화 조건
   * - 변경된 값이 있어야 함
   * - 이미지, 상품명, 가격 필드가 모두 채워져 있어야 함
   */
  const isSavable = isChanged && hasImage && trimmedName.length > 0 && parsedPrice > 0;

  const bannerMessage = EDIT_BANNER_MESSAGE[item.status];

  const handleSave = () => {
    onSave({
      ...(isNameChanged && { name: trimmedName }),
      ...(isPriceChanged && { price: parsedPrice }),
      ...(selectedImage && { image: selectedImage }),
    });
  };

  return (
    <>
      {bannerMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-bg-warning p-3">
          <WarningIconFill className="size-5 shrink-0 text-icon-warning" />
          <span className="body-2-regular text-text-warning">{bannerMessage}</span>
        </div>
      )}

      <ItemImagePicker
        imageUrl={item.imageUrl}
        onImageSelect={setSelectedImage}
        className={bannerMessage ? 'mt-4' : 'mt-5'}
      />

      <Spacing size={16} />

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
          variant="primary"
          size="lg"
          isLoading={isSavePending}
          disabled={!isSavable}
          onClick={handleSave}
        >
          저장하기
        </Button>
      </BottomCta>
    </>
  );
}

export default ItemEditForm;
