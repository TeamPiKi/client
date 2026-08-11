'use client';

import { useState } from 'react';

import { TrashIconOutline } from '@/assets/icons';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { Header, HeaderIcon } from '@/components/header';
import type { ItemTypeT, PatchItemRequestT } from '@/types/item';
import { cn } from '@/utils/cn';

import ItemDetailView from './ItemDetailView';
import ItemEditForm from './ItemEditForm';
import PriceRefreshFailedDialog from './PriceRefreshFailedDialog';
import { ITEM_INFO_SCREEN_CONFIG, isReadyItemInfo } from './itemInfoScreen.const';
import type { ItemInfoT, MemoT, PriceRefreshT } from './itemInfoScreen.type';

type ItemInfoScreenProps = {
  itemType: ItemTypeT;
  item: ItemInfoT;
  onSave: (data: PatchItemRequestT, onSuccess: () => void) => void;
  isSavePending?: boolean;
  onDelete: () => void;
  isDeletePending?: boolean;
  /** 가격 정보 새로고침 가능 여부 */
  priceRefresh?: PriceRefreshT;
  memo?: MemoT;
};

/**
 * 상품 정보 화면 — 조회와 직접 입력을 한 화면에서 전환한다
 *
 * - READY 가 아니면 보여줄 정보가 없으므로 곧바로 입력 폼으로 진입한다
 * - READY 는 조회 화면을 보여주고, "상품 정보 수정"·가격 갱신 실패 시 입력 폼으로 전환된다
 */
function ItemInfoScreen({
  itemType,
  item,
  onSave,
  isSavePending,
  onDelete,
  isDeletePending,
  priceRefresh,
  memo,
}: ItemInfoScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { viewTitle, deleteConfirmTitle } = ITEM_INFO_SCREEN_CONFIG[itemType];

  /** 조회 모드 여부 — READY 이면서 수정 버튼을 누르지 않은 상태 */
  const isDetailMode = isReadyItemInfo(item) && !isEditing;

  const handleRefreshFailedEdit = () => {
    priceRefresh?.closeFailedDialog();
    setIsEditing(true);
  };

  return (
    <div className="flex h-dvh flex-col bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top">
      <Header
        /** 수정 모드에서의 뒤로가기는 페이지 이탈이 아니라 조회 화면 복귀다 */
        left={<HeaderIcon name="BACK" {...(isEditing && { onClick: () => setIsEditing(false) })} />}
        center={isDetailMode ? viewTitle : '위시 정보 수정'}
        centerClassName="heading-1-bold"
        /** 삭제는 조회 화면에서만 */
        right={
          isDetailMode && (
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

      <main
        className={cn(
          'mt-2 hide-scrollbar min-h-0 flex-1 overflow-y-auto',
          isDetailMode ? 'pb-[98px]' : 'pb-40'
        )}
      >
        {isDetailMode ? (
          <ItemDetailView
            item={item}
            memo={memo}
            priceRefresh={priceRefresh}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <ItemEditForm
            item={item}
            onSave={data => onSave(data, () => setIsEditing(false))}
            isSavePending={isSavePending}
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

      {priceRefresh && (
        <PriceRefreshFailedDialog
          open={priceRefresh.isFailed}
          onClose={priceRefresh.closeFailedDialog}
          onEdit={handleRefreshFailedEdit}
        />
      )}
    </div>
  );
}

export default ItemInfoScreen;
