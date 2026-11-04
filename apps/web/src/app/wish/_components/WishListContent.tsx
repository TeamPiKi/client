'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import CollapsibleTitle from '@/components/common/collapsible-title';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetWishesCount } from '@/hooks/useGetWishesCount';
import type { FolderT } from '@/types/folder';
import { cn } from '@/utils/cn';

import WishEditActionBar from '../_common/_components/WishEditActionBar';
import WishEditHeader from '../_common/_components/WishEditHeader';
import { WISH_MODE } from '../_common/_consts/wishMode';
import { useDeleteWishes } from '../_common/_hooks/useDeleteWishes';
import { usePostFolderWishes } from '../_common/_hooks/usePostFolderWishes';
import { useWishEditMode } from '../_common/_hooks/useWishEditMode';
import { WISH_TAB } from '../_consts/wishTab';
import { useShareIntentWish } from '../_hooks/useShareIntentWish';
import { parseWishTabParam } from '../_utils/wishSearchParams';
import WishSearch from './WishSearch';
import WishTabBar from './WishTabBar';
import WishTabContent from './WishTabContent';
import WishTabSummary from './WishTabSummary';

function WishListContent() {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  useShareIntentWish();

  const { wishesCountData } = useGetWishesCount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    mode,
    selectedWishIds,
    handleToggleSelect,
    handleClearSelection,
    handleEnterEditMode,
    handleExitEditMode,
  } = useWishEditMode();

  const { postFolderWishesMutation } = usePostFolderWishes({
    onSuccess: folder => {
      handleClearSelection();
      toast.success(`상품을 '${folder.name}' 폴더로 이동했어요.`);
    },
  });
  const { deleteWishesMutation } = useDeleteWishes({ onSuccess: handleClearSelection });

  /** 전체 위시에서는 기존 소속 폴더를 유지한 채 대상 폴더에 추가 */
  const handleMove = (folder: FolderT) =>
    postFolderWishesMutation({ folder, wishIds: Array.from(selectedWishIds) });

  const handleDelete = () => deleteWishesMutation(Array.from(selectedWishIds));

  return (
    <>
      <div
        className={cn(
          'sticky top-0 flex flex-col gap-6 bg-bg-layer-default px-5 pt-padding-top',
          isFolderTab ? 'pb-4' : 'pb-6'
        )}
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        {mode === WISH_MODE.EDIT ? (
          <WishEditHeader selectedCount={selectedWishIds.size} onDone={handleExitEditMode} />
        ) : (
          <>
            <CollapsibleTitle>내 위시리스트</CollapsibleTitle>
            <WishTabBar />
          </>
        )}
        <WishTabSummary
          wishCount={wishesCountData}
          mode={mode}
          onEdit={handleEnterEditMode}
          onSearch={() => setIsSearchOpen(true)}
        />
      </div>
      <WishTabContent
        allWishTabContentProps={{
          ...(mode === WISH_MODE.EDIT && { selectedWishIds, onToggleSelect: handleToggleSelect }),
        }}
      />

      {mode === WISH_MODE.EDIT && (
        <WishEditActionBar
          selectedCount={selectedWishIds.size}
          onMove={handleMove}
          onDelete={handleDelete}
          deleteConfirm={{
            title: '상품을 정말 삭제할까요?',
            description: '삭제 후에는 다시 복구할 수 없어요.',
          }}
        />
      )}

      {isSearchOpen && <WishSearch onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default WishListContent;
