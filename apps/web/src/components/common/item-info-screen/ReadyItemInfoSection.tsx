'use client';

import { useState } from 'react';

import { EditIconFill, TagIconFill } from '@/assets/icons';
import Spacing from '@/components/spacing';
import type { ItemStatusT, PatchItemRequestT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';
import parsePriceToNumber from '@/utils/parsePriceToNumber';

import ItemImageSection from './ItemImageSection';
import ItemLinkBanner from './ItemLinkBanner';
import ItemMemoDialog from './ItemMemoDialog';

type ReadyItemInfoSectionProps = {
  sourceUrl?: string | null;
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

function ReadyItemInfoSection({
  sourceUrl,
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
}: ReadyItemInfoSectionProps) {
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
      <div className="relative">
        <ItemImageSection
          itemStatus={itemStatus}
          imageUrl={initialImageUrl}
          onImageSelect={setSelectedImage}
        />
        {sourceUrl && <ItemLinkBanner href={sourceUrl} />}
      </div>

      <Spacing size={14} />

      <div className="rounded-xl bg-bg-layer-floating p-4">
        <div className="line-clamp-2 body-1-medium break-keep text-text-neutral-primary">
          {initialName}
        </div>

        <Spacing size={8} />

        <div className="heading-2-semibold">{formatPrice(String(initialPrice))}</div>

        <Spacing size={16} />

        <div className="flex gap-2">
          {onRefresh && (
            <button className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-bg-accent/8 p-3 body-2-medium">
              <TagIconFill className="size-4 text-icon-accent" />
              가격 정보 새로고침
            </button>
          )}
          <button className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-gray-50 p-3 body-2-medium">
            <EditIconFill className="size-4 text-icon-neutral-primary" />
            상품 정보 수정
          </button>
        </div>
      </div>

      <Spacing size={14} />

      <ItemMemoDialog />
    </>
  );
}

export default ReadyItemInfoSection;
