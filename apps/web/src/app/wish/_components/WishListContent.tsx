'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Z_INDEX } from '@/consts/zIndex';

import WishEditActionBar from '../_common/_components/WishEditActionBar';
import WishEditHeader from '../_common/_components/WishEditHeader';
import WishSearchLink from '../_common/_components/WishSearchLink';
import { MOCK_WISHES } from '../_common/_consts/wishMock';
import { WISH_MODE } from '../_common/_consts/wishMode';
import { useWishEditMode } from '../_common/_hooks/useWishEditMode';
import type { WishFolderT } from '../_common/_types/wish';
import WishTabBar from './WishTabBar';
import WishTabContent from './WishTabContent';
import WishTabSummary from './WishTabSummary';

function WishListContent() {
  /** TEMP: API 연동 시 위시 목록 조회 응답으로 교체 */
  const [wishes, setWishes] = useState(MOCK_WISHES);
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

  return (
    <>
      <div
        className="sticky top-0 flex flex-col gap-6 bg-bg-layer-basement px-5 pt-padding-top pb-4"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        {mode === WISH_MODE.EDIT ? (
          <WishEditHeader selectedCount={selectedWishIds.size} onDone={handleExitEditMode} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="heading-1-bold text-text-neutral-primary">내 위시리스트</h1>
              <WishSearchLink />
            </div>
            <WishTabBar />
          </>
        )}
        <WishTabSummary wishCount={wishes.length} mode={mode} onEdit={handleEnterEditMode} />
      </div>
      <WishTabContent
        wishes={wishes}
        {...(mode === WISH_MODE.EDIT && { selectedWishIds, onToggleSelect: handleToggleSelect })}
      />

      {mode === WISH_MODE.EDIT && (
        <WishEditActionBar
          selectedCount={selectedWishIds.size}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default WishListContent;
