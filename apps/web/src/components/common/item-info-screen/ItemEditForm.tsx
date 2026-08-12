'use client';

import { useState } from 'react';

import { WarningIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Input from '@/components/input';
import Spacing from '@/components/spacing';
import { ITEM_STATUS } from '@/consts/item';
import type { PatchItemRequestT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';
import parsePriceToNumber from '@/utils/parsePriceToNumber';

import ItemImagePicker from './ItemImagePicker';
import type { ItemInfoT } from './itemInfoScreen.type';

type ItemEditFormProps = {
  item: ItemInfoT;
  onSave: (data: PatchItemRequestT) => void;
  isSavePending?: boolean;
};

/** 상품 정보를 직접 입력·수정하는 폼 — FAILED 진입과 READY 의 "상품 정보 수정"이 공유한다 */
function ItemEditForm({ item, onSave, isSavePending = false }: ItemEditFormProps) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price ? formatPrice(String(item.price)) : '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const trimmedName = name.trim();
  const parsedPrice = parsePriceToNumber(price);

  const isNameChanged = trimmedName !== item.name.trim();
  const isPriceChanged = parsedPrice !== item.price;

  const hasImage = item.imageUrl !== null || selectedImage !== null;
  const isChanged = isNameChanged || isPriceChanged || selectedImage !== null;
  /**
   * 저장하기 버튼 활성화 조건
   * - 변경된 값이 있어야 함
   * - 이미지, 상품명, 가격 필드가 모두 채워져 있어야 함
   */
  const isSavable = isChanged && hasImage && trimmedName.length > 0 && parsedPrice > 0;

  const handleSave = () => {
    onSave({
      ...(isNameChanged && { name: trimmedName }),
      ...(isPriceChanged && { price: parsedPrice }),
      ...(selectedImage && { image: selectedImage }),
    });
  };

  return (
    <>
      {item.status === ITEM_STATUS.FAILED && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-bg-warning p-3">
          <WarningIconFill className="size-5 shrink-0 text-icon-warning" />
          <span className="body-2-regular text-text-warning">
            상품 정보를 가져오는데 실패했어요. 직접 입력해주세요.
          </span>
        </div>
      )}

      <ItemImagePicker
        imageUrl={item.imageUrl}
        onImageSelect={setSelectedImage}
        className={item.status === ITEM_STATUS.FAILED ? 'mt-2' : 'mt-5'}
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
