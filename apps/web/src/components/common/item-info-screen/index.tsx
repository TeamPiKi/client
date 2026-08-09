'use client';

import { useState } from 'react';

import { TrashIconOutline } from '@/assets/icons';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { Header, HeaderIcon } from '@/components/header';
import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT, PatchItemRequestT } from '@/types/item';
import { cn } from '@/utils/cn';

import ItemDetailView from './ItemDetailView';
import ItemEditForm from './ItemEditForm';
import PriceRefreshFailedDialog from './PriceRefreshFailedDialog';

type ItemInfoScreenProps = {
  /** 링크로 담은 경우에만 — 이미지 위 원본 링크 칩 */
  sourceUrl?: string | null;
  /** 메모를 지원하는 화면(위시 상세)에서만 노출 */
  hasMemo?: boolean;
  viewTitle?: string;
  deleteConfirmTitle?: string;
  onSave: (data: PatchItemRequestT) => void;
  isSavePending?: boolean;
  onDelete: () => void;
  isDeletePending?: boolean;
  /** 링크로 담은 경우에만 — 가격 정보 새로고침 */
  onRefresh?: () => void;
  isRefreshPending?: boolean;
  isRefreshFailed?: boolean;
  onRefreshFailedClose?: () => void;
} & (
  | {
      /** READY 응답은 이미지·상품명·가격을 항상 포함한다 */
      itemStatus: typeof ITEM_STATUS.READY;
      imageUrl: string;
      name: string;
      price: number;
    }
  | {
      itemStatus: Exclude<ItemStatusT, typeof ITEM_STATUS.READY>;
      imageUrl: string | null;
      name: string;
      price: number;
    }
);

/**
 * 상품 정보 화면 — 조회와 직접 입력을 한 화면에서 전환한다
 *
 * - READY 가 아니면 보여줄 정보가 없으므로 곧바로 입력 폼으로 진입한다
 * - READY 는 조회 화면을 보여주고, "상품 정보 수정"·가격 갱신 실패 시 입력 폼으로 전환된다
 */
function ItemInfoScreen({
  itemStatus,
  imageUrl,
  name,
  price,
  sourceUrl,
  hasMemo = false,
  viewTitle = '위시 정보',
  deleteConfirmTitle = '위시를 삭제할까요?',
  onSave,
  isSavePending,
  onDelete,
  isDeletePending,
  onRefresh,
  isRefreshPending,
  isRefreshFailed = false,
  onRefreshFailedClose,
}: ItemInfoScreenProps) {
  /**
   * 수정 모드 여부
   * - true: 이미지, 상품명, 가격 수정 가능 (메모 수정 불가)
   * - false: 조회 (메모 수정 가능)
   *
   * - READY 가 아닌 상태에서는 항상 true
   * - READY 상태에서는 조회 화면에서 수정 버튼을 눌러 true로 변경
   */
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isEditMode = itemStatus !== ITEM_STATUS.READY || isEditing;

  const handleRefreshFailedEdit = () => {
    onRefreshFailedClose?.();
    setIsEditing(true);
  };

  return (
    <div
      className={cn(
        'hide-scrollbar min-h-dvh overflow-y-auto bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top',
        isEditMode ? 'pb-[102px]' : 'pb-[98px]'
      )}
    >
      <Header
        /** 수정 모드에서의 뒤로가기는 페이지 이탈이 아니라 조회 화면 복귀다 */
        left={<HeaderIcon name="BACK" {...(isEditing && { onClick: () => setIsEditing(false) })} />}
        center={isEditMode ? '위시 정보 수정' : viewTitle}
        centerClassName="heading-1-bold"
        /** 삭제는 조회 화면에서만 */
        right={
          !isEditMode && (
            <button
              type="button"
              aria-label="삭제하기"
              className="cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIconOutline className="size-6 text-icon-neutral-secondary" />
            </button>
          )
        }
      />

      <main>
        {isEditMode ? (
          <ItemEditForm
            itemStatus={itemStatus}
            initialImageUrl={imageUrl}
            initialName={name}
            initialPrice={price}
            onSave={onSave}
            isSavePending={isSavePending}
          />
        ) : (
          <ItemDetailView
            imageUrl={imageUrl}
            name={name}
            price={price}
            sourceUrl={sourceUrl}
            hasMemo={hasMemo}
            onRefresh={onRefresh}
            isRefreshPending={isRefreshPending}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </main>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={deleteConfirmTitle}
        description="삭제 후에는 다시 복구할 수 없어요."
        confirmLabel="삭제하기"
        isPending={isDeletePending}
        onConfirm={onDelete}
      />

      <PriceRefreshFailedDialog
        open={isRefreshFailed}
        onOpenChange={isOpen => {
          if (!isOpen) onRefreshFailedClose?.();
        }}
        onEdit={handleRefreshFailedEdit}
      />
    </div>
  );
}

export default ItemInfoScreen;
