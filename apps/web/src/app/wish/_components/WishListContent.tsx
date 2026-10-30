'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Z_INDEX } from '@/consts/zIndex';
import { useGetFolders } from '@/hooks/useGetFolders';
import { useGetWishes } from '@/hooks/useGetWishes';
import type { FolderT } from '@/types/folder';
import { cn } from '@/utils/cn';
import { getScrollContainer } from '@/utils/scrollRestoration';

import WishEditActionBar from '../_common/_components/WishEditActionBar';
import WishEditHeader from '../_common/_components/WishEditHeader';
import { WISH_MODE } from '../_common/_consts/wishMode';
import { useDeleteWishes } from '../_common/_hooks/useDeleteWishes';
import { usePostFolderWishes } from '../_common/_hooks/usePostFolderWishes';
import { useWishEditMode } from '../_common/_hooks/useWishEditMode';
import { WISH_TAB } from '../_consts/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';
import WishSearch from './WishSearch';
import WishTabBar from './WishTabBar';
import WishTabContent from './WishTabContent';
import WishTabSummary from './WishTabSummary';

const TITLE_HEIGHT_WITH_GAP = 52;

function WishListContent() {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  const { wishesData, hasNextPage } = useGetWishes();
  const { foldersData } = useGetFolders();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTitleHidden, setIsTitleHidden] = useState(false);
  const {
    mode,
    selectedWishIds,
    handleToggleSelect,
    handleClearSelection,
    handleEnterEditMode,
    handleExitEditMode,
  } = useWishEditMode();

  const { postFolderWishesMutation } = usePostFolderWishes({ onSuccess: handleClearSelection });
  const { deleteWishesMutation } = useDeleteWishes({ onSuccess: handleClearSelection });

  /** 전체 위시에서는 기존 소속 폴더를 유지한 채 대상 폴더에 추가 */
  const handleMove = (folder: FolderT) =>
    postFolderWishesMutation({ folder, wishIds: Array.from(selectedWishIds) });

  const handleDelete = () => deleteWishesMutation(Array.from(selectedWishIds));

  /** 스크롤 시 제목 부분을 숨김/노출 처리 함 */
  useEffect(() => {
    const scroller = getScrollContainer();
    if (!scroller) return;

    const handleScroll = () => {
      if (scroller.scrollTop > TITLE_HEIGHT_WITH_GAP) setIsTitleHidden(true);
      else if (scroller.scrollTop <= 0) setIsTitleHidden(false);
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div
              className={cn(
                'grid transition-all duration-100',
                isTitleHidden ? '-mb-6 grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]'
              )}
            >
              <h1 className="min-h-0 overflow-hidden heading-1-bold text-text-neutral-primary">
                내 위시리스트
              </h1>
            </div>
            <WishTabBar />
          </>
        )}
        <WishTabSummary
          wishCount={wishesData.length}
          hasMoreWishes={hasNextPage}
          folderCount={foldersData.length}
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
