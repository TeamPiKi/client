'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ChevronBackwardIconFill } from '@/assets/icons';
import WishGrid from '@/components/common/wish-grid';
import { Header } from '@/components/header';
import Spacing from '@/components/spacing';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import type { FolderT } from '@/types/folder';

import WishEditActionBar from '../../../_common/_components/WishEditActionBar';
import WishEditHeader from '../../../_common/_components/WishEditHeader';
import { MOCK_FOLDERS, MOCK_WISHES } from '../../../_common/_consts/wishMock';
import { WISH_MODE } from '../../../_common/_consts/wishMode';
import { useWishEditMode } from '../../../_common/_hooks/useWishEditMode';
import FolderWishAddDialog from './FolderWishAddDialog';

const MAX_DISPLAY_COUNT = 999;

type FolderDetailContentProps = {
  folderId: number | null;
};

function FolderDetailContent({ folderId }: FolderDetailContentProps) {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();

  const folder = MOCK_FOLDERS.find(({ id }) => id === folderId);

  /** TEMP: API 연동 시 폴더 위시 조회 응답으로 교체 */
  const [wishes, setWishes] = useState(() =>
    MOCK_WISHES.filter(({ wish }) => folder?.wishIds.includes(wish.id))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {
    mode,
    selectedWishIds,
    handleToggleSelect,
    handleClearSelection,
    handleSelectAll,
    handleEnterEditMode,
    handleExitEditMode,
  } = useWishEditMode();

  /** 없는 폴더는 안내 후 폴더 탭으로 — 기록에 남기지 않는다 */
  useEffect(() => {
    if (folder) return;

    toast.error('폴더를 찾을 수 없어요.');
    router.replace(ROUTES.WISHLIST_FOLDER_TAB);
  }, [folder, router]);

  if (!folder) return null;

  /** TODO: 폴더 이동 API 연결 */
  const handleMove = (targetFolder: FolderT) => {
    setWishes(prev => prev.filter(({ wish }) => !selectedWishIds.has(wish.id)));
    handleClearSelection();
    toast.success(`상품을 '${targetFolder.name}' 폴더로 이동했어요.`);
  };

  /** TODO: 폴더에서 빼기 API 연결 */
  const handleDelete = () => {
    setWishes(prev => prev.filter(({ wish }) => !selectedWishIds.has(wish.id)));
    handleClearSelection();
    toast.success(`폴더에서 상품 ${selectedWishIds.size}개를 삭제했어요.`);
  };

  return (
    <>
      <div
        className="sticky top-0 bg-bg-layer-default pt-padding-top"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        {mode === WISH_MODE.EDIT ? (
          <div className="px-5">
            <WishEditHeader selectedCount={selectedWishIds.size} onDone={handleExitEditMode} />
          </div>
        ) : (
          <div className="pr-5 pl-2.5">
            <Header
              left={
                <button
                  type="button"
                  aria-label="뒤로가기"
                  onClick={() => backWithFallback(ROUTES.WISHLIST_FOLDER_TAB)}
                  className="cursor-pointer"
                >
                  <ChevronBackwardIconFill className="size-7.5 text-icon-neutral-primary" />
                </button>
              }
              center={
                <h1 className="max-w-55 truncate heading-1-bold text-text-neutral-primary">
                  {folder.name}
                </h1>
              }
            />
          </div>
        )}
        <Spacing size={24} />
        <div className="flex items-center justify-between px-5 body-2-medium">
          {mode === WISH_MODE.EDIT ? (
            <>
              <p className="flex items-center gap-2 text-text-neutral-tertiary">
                {folder.name}
                <span aria-hidden className="h-[12.6px] w-px bg-gray-300" />
                전체({wishes.length})
              </p>
              <button
                type="button"
                onClick={() => handleSelectAll(wishes.map(({ wish }) => wish.id))}
                className="cursor-pointer text-text-neutral-secondary"
              >
                전체 선택
              </button>
            </>
          ) : (
            <>
              <p className="text-text-neutral-tertiary">
                상품 {wishes.length > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : wishes.length}
              </p>
              <div className="flex items-center gap-3 text-text-neutral-secondary">
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="cursor-pointer"
                >
                  추가
                </button>
                <span aria-hidden className="h-3.5 w-[1.4px] bg-gray-300" />
                <button type="button" onClick={handleEnterEditMode} className="cursor-pointer">
                  편집
                </button>
              </div>
            </>
          )}
        </div>
        <Spacing size={24} />
      </div>

      {/** TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: folderId) 추가 */}
      <WishGrid
        wishes={wishes}
        {...(mode === WISH_MODE.EDIT && { selectedWishIds, onToggleSelect: handleToggleSelect })}
      />

      {mode === WISH_MODE.EDIT && (
        <WishEditActionBar
          selectedCount={selectedWishIds.size}
          currentFolderId={folder.id}
          onMove={handleMove}
          onDelete={handleDelete}
          deleteConfirm={{
            title: `선택한 상품 ${selectedWishIds.size}개를 삭제할까요?`,
            description: '폴더에서만 삭제되며, 전체 위시에는 남아있어요.',
            icon: null,
          }}
        />
      )}

      <FolderWishAddDialog
        folderId={folder.id}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}

export default FolderDetailContent;
