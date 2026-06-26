'use client';

import { useState } from 'react';

import { useWishlistDelete } from '../../_hooks/useDeleteWishes';
import { useShareIntentWish } from '../../_hooks/useShareIntentWish';
import WishAddDialog from '../WishAddDialog';
import WishlistBottomBar from '../WishlistBottomBar';
import WishlistFabArea from '../WishlistFabArea';
import WishlistList from '../WishlistList';

function WishContentClient() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useShareIntentWish();
  const {
    isDeleteMode,
    selectedIds,
    isDeleteWishesPending,
    handleEnterDeleteMode,
    handleToggleSelect,
    handleConfirmDelete,
  } = useWishlistDelete();

  return (
    <>
      <div className="flex flex-1 flex-col pb-24">
        <WishlistList
          isDeleteMode={isDeleteMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      </div>

      <WishlistBottomBar isDeleteMode={isDeleteMode} selectedCount={selectedIds.size} />

      <WishlistFabArea
        isDeleteMode={isDeleteMode}
        isDeleteWishesPending={isDeleteWishesPending}
        isDeleteDisabled={selectedIds.size === 0}
        onAddItem={() => setIsAddDialogOpen(true)}
        onEnterDeleteMode={handleEnterDeleteMode}
        onConfirmDelete={handleConfirmDelete}
      />

      <WishAddDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}

export default WishContentClient;
