'use client';

import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { CloseIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import WishGrid from '@/components/common/wish-grid';
import { Header } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { useGetFolders } from '@/hooks/useGetFolders';
import { useGetWishes } from '@/hooks/useGetWishes';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import type { FolderT } from '@/types/folder';

import { MAX_FOLDER_WISH_SELECT_COUNT } from '../../../../_common/_consts/folder';
import { usePostFolderWishes } from '../../../../_common/_hooks/usePostFolderWishes';
import { useWishEditMode } from '../../../../_common/_hooks/useWishEditMode';
import { formatWishCount } from '../../../../_common/_utils/formatWishCount';

type FolderWishSelectContentProps = {
  folderId: number | null;
};

function FolderWishSelectView({ folder }: { folder: FolderT }) {
  const backWithFallback = useBackWithFallback();

  const { wishesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishes({
    excludeFolderId: folder.id,
  });
  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage && !isFetchingNextPage);

  const { selectedWishIds, handleToggleSelect } = useWishEditMode();

  const handleBack = () => backWithFallback(ROUTES.WISHLIST_FOLDER(folder.id));

  const { postFolderWishesMutation, isPostFolderWishesPending } = usePostFolderWishes({
    onSuccess: handleBack,
  });

  const handleToggle = (wishId: number) => {
    if (!selectedWishIds.has(wishId) && selectedWishIds.size >= MAX_FOLDER_WISH_SELECT_COUNT) {
      toast.error(ERROR_MESSAGE_MAP[ERROR_CODE.FOLDER_INVALID_WISH_COUNT]);
      return;
    }

    handleToggleSelect(wishId);
  };

  const handleSubmit = () =>
    postFolderWishesMutation({ folder, wishIds: Array.from(selectedWishIds) });

  return (
    <>
      <div
        className="sticky top-0 flex flex-col gap-6 bg-bg-layer-basement px-5 pt-padding-top pb-6"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <Header
          center={<h1 className="heading-1-bold text-text-neutral-primary">폴더에 위시 추가</h1>}
          right={
            <button type="button" aria-label="닫기" onClick={handleBack} className="cursor-pointer">
              <CloseIconFill className="size-6 text-icon-neutral-primary" />
            </button>
          }
        />
        <p className="body-2-medium text-text-neutral-tertiary">
          상품 {formatWishCount(wishesData.length, hasNextPage)}
        </p>
      </div>

      <WishGrid
        wishes={wishesData}
        selectedWishIds={selectedWishIds}
        onToggleSelect={handleToggle}
      />
      <div ref={bottomRef} />

      <BottomCta hasGradient>
        <Button
          size="lg"
          disabled={selectedWishIds.size === 0}
          isLoading={isPostFolderWishesPending}
          onClick={handleSubmit}
        >
          선택한 {selectedWishIds.size}개의 상품 추가
        </Button>
      </BottomCta>
    </>
  );
}

function FolderWishSelectContent({ folderId }: FolderWishSelectContentProps) {
  const router = useRouter();
  const { foldersData } = useGetFolders();

  const folder = foldersData.find(({ id }) => id === folderId);

  useEffect(() => {
    if (folder) return;

    toast.error('폴더를 찾을 수 없어요.');
    router.replace(ROUTES.WISHLIST_FOLDER_TAB);
  }, [folder, router]);

  if (!folder) return null;

  return <FolderWishSelectView folder={folder} />;
}

export default FolderWishSelectContent;
