'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { CloseIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Header } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import WishGrid from '../../../../_common/_components/WishGrid';
import { MOCK_FOLDERS, MOCK_WISHES } from '../../../../_common/_consts/wishMock';
import { useWishEditMode } from '../../../../_common/_hooks/useWishEditMode';

const MAX_DISPLAY_COUNT = 999;

type FolderWishSelectContentProps = {
  folderId: number | null;
};

function FolderWishSelectContent({ folderId }: FolderWishSelectContentProps) {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();

  const folder = MOCK_FOLDERS.find(({ id }) => id === folderId);
  /** TEMP: API 연동 시 위시 목록 조회 응답으로 교체 */
  const candidates = MOCK_WISHES.filter(({ wish }) => !folder?.wishIds.includes(wish.id));

  const { selectedWishIds, handleToggleSelect } = useWishEditMode();

  useEffect(() => {
    if (folder) return;

    toast.error('폴더를 찾을 수 없어요.');
    router.replace(ROUTES.WISHLIST_FOLDER_TAB);
  }, [folder, router]);

  if (!folder) return null;

  /** TODO: 폴더에 위시 추가 API 연결 */
  const handleSubmit = () => backWithFallback(ROUTES.WISHLIST_FOLDER(folder.id));

  return (
    <>
      <div
        className="sticky top-0 flex flex-col gap-6 bg-bg-layer-basement px-5 pt-padding-top pb-6"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <Header
          center={<h1 className="heading-1-bold text-text-neutral-primary">폴더에 위시 추가</h1>}
          right={
            <button
              type="button"
              aria-label="닫기"
              onClick={() => backWithFallback(ROUTES.WISHLIST_FOLDER(folder.id))}
              className="cursor-pointer"
            >
              <CloseIconFill className="size-6 text-icon-neutral-primary" />
            </button>
          }
        />
        <p className="body-2-medium text-text-neutral-tertiary">
          상품 {candidates.length > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : candidates.length}
        </p>
      </div>

      <WishGrid
        wishes={candidates}
        selectedWishIds={selectedWishIds}
        onToggleSelect={handleToggleSelect}
      />

      <BottomCta hasGradient>
        <Button size="lg" disabled={selectedWishIds.size === 0} onClick={handleSubmit}>
          선택한 {selectedWishIds.size}개의 상품 추가
        </Button>
      </BottomCta>
    </>
  );
}

export default FolderWishSelectContent;
