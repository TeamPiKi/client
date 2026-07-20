'use client';

import { useState } from 'react';

import TrashIconFill from '@/assets/icons/fill/trash.svg';
import CheckboxSelectedIconFill from '@/assets/icons/fill/checkbox-selected.svg';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { useGetWishlist } from '@/hooks/useGetWishlist';

import { useDeleteWishes } from '../_hooks/useDeleteWishes';
import { useShareIntentWish } from '../_hooks/useShareIntentWish';
import WishAddDialog from './WishAddDialog';
import WishlistBottomBar from './WishlistBottomBar';
import WishlistFabArea from './WishlistFabArea';
import WishlistList from './WishlistList';

function WishContentClient() {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useShareIntentWish();

  const {
    selectedIds,
    isDeleteWishesPending,
    handleToggleSelect,
    handleSelectAll,
    handleClearSelection,
    handleDeleteWishes,
  } = useDeleteWishes({
    onSuccess: () => {
      setIsDeleteMode(false);
      setIsDeleteDialogOpen(false);
    },
  });

  const { wishlistData } = useGetWishlist();
  const selectableIds = wishlistData
    .filter(
      item =>
        item.status !== 'FAILED' && item.status !== 'PENDING' && item.status !== 'PROCESSING'
    )
    .map(item => item.id);
  const isAllSelected =
    selectableIds.length > 0 && selectableIds.every(id => selectedIds.has(id));

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    handleClearSelection();
  };

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    handleClearSelection();
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      handleClearSelection();
    } else {
      handleSelectAll(selectableIds);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg-layer-basement">
      <div className="sticky top-0 z-20 flex flex-col gap-7 bg-bg-layer-basement px-5 pt-padding-top pb-6">
        <h1 className="heading-1 text-text-neutral-primary">내 위시리스트</h1>

        {isDeleteMode ? (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="flex w-[110px] cursor-pointer items-center gap-2"
            >
              <span className="relative block size-3 overflow-hidden">
                {isAllSelected ? (
                  <>
                    <span className="absolute inset-[1px] bg-white" />
                    <CheckboxSelectedIconFill className="absolute inset-0 size-3 origin-center scale-[1.334] text-uac-light" />
                  </>
                ) : (
                  <span className="block size-3 rounded-[2.4px] border-[0.84px] border-gray-400" />
                )}
              </span>
              <span className="body-2-medium text-border-neutral-secondary">전체선택</span>
            </button>
            <button
              type="button"
              onClick={handleExitDeleteMode}
              className="body-2-medium cursor-pointer text-text-neutral-secondary"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEnterDeleteMode}
            className="ml-auto flex cursor-pointer items-center gap-1 body-2-semibold text-text-neutral-secondary"
          >
            <TrashIconFill width={20} height={20} />
            삭제
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pb-24">
        <WishlistList
          isDeleteMode={isDeleteMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      </div>

      <WishlistBottomBar
        isDeleteMode={isDeleteMode}
        selectedCount={selectedIds.size}
        onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
      />

      <WishlistFabArea isDeleteMode={isDeleteMode} onAddItem={() => setIsAddDialogOpen(true)} />

      <WishAddDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={open => {
          if (!open && isDeleteWishesPending) return;
          setIsDeleteDialogOpen(open);
        }}
        title="상품을 정말 삭제할까요?"
        description="삭제 후에는 다시 복구할 수 없어요."
        confirmLabel="삭제하기"
        cancelLabel="취소하기"
        isPending={isDeleteWishesPending}
        onConfirm={handleDeleteWishes}
      />
    </div>
  );
}

export default WishContentClient;
