'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import WishEditActionBar from '../_common/_components/WishEditActionBar';
import WishEditHeader from '../_common/_components/WishEditHeader';
import { MOCK_FOLDERS, MOCK_WISHES } from '../_common/_consts/wishMock';
import { WISH_MODE } from '../_common/_consts/wishMode';
import { useWishEditMode } from '../_common/_hooks/useWishEditMode';
import type { WishFolderT } from '../_common/_types/wish';
import { WISH_TAB } from '../_consts/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';
import WishSearch from './WishSearch';
import WishTabBar from './WishTabBar';
import WishTabContent from './WishTabContent';
import WishTabSummary from './WishTabSummary';

function WishListContent() {
  const searchParams = useSearchParams();
  const isFolderTab = parseWishTabParam(searchParams.get('tab')) === WISH_TAB.FOLDER;

  /** TEMP: API 연동 시 위시 목록 조회 응답으로 교체 */
  const [wishes, setWishes] = useState(MOCK_WISHES);
  /** TEMP: API 연동 시 폴더 목록 조회·생성·수정·삭제 API 로 교체 */
  const [folders, setFolders] = useState(MOCK_FOLDERS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    mode,
    selectedWishIds,
    handleToggleSelect,
    handleClearSelection,
    handleEnterEditMode,
    handleExitEditMode,
  } = useWishEditMode();

  /** TODO: 폴더 추가 API 연결. 기존 소속 폴더는 유지됨 */
  const handleMove = (folder: WishFolderT) => {
    handleClearSelection();
    toast.success(`상품을 '${folder.name}' 폴더로 이동했어요.`);
  };

  /** TODO: 위시 삭제 API 연결 */
  const handleDelete = () => {
    setWishes(prev => prev.filter(({ wish }) => !selectedWishIds.has(wish.id)));
    handleClearSelection();
    toast.success(`상품 ${selectedWishIds.size}개를 삭제했어요.`);
  };

  const handleCreateFolder = (name: string) =>
    setFolders(prev => [...prev, { id: Date.now(), name, wishIds: [] }]);

  const handleRenameFolder = (folderId: number, name: string) =>
    setFolders(prev => prev.map(folder => (folder.id === folderId ? { ...folder, name } : folder)));

  const handleDeleteFolder = (folderId: number) =>
    setFolders(prev => prev.filter(({ id }) => id !== folderId));

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
            <h1 className="heading-1-bold text-text-neutral-primary">내 위시리스트</h1>
            <WishTabBar />
          </>
        )}
        <WishTabSummary
          wishCount={wishes.length}
          folderCount={folders.length}
          mode={mode}
          onEdit={handleEnterEditMode}
          onSearch={() => setIsSearchOpen(true)}
        />
      </div>
      <WishTabContent
        allWishTabContentProps={{
          wishes,
          ...(mode === WISH_MODE.EDIT && { selectedWishIds, onToggleSelect: handleToggleSelect }),
        }}
        folderTabContentProps={{
          folders,
          onCreate: handleCreateFolder,
          onRename: handleRenameFolder,
          onDelete: handleDeleteFolder,
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

      {isSearchOpen && <WishSearch wishes={wishes} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default WishListContent;
