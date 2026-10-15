'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { ChevronBackwardIconFill } from '@/assets/icons';
import { Header } from '@/components/header';
import Spacing from '@/components/spacing';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import WishGrid from '../../../_common/_components/WishGrid';
import WishSearchLink from '../../../_common/_components/WishSearchLink';
import { MOCK_FOLDERS, MOCK_WISHES } from '../../../_common/_consts/wishMock';

type FolderDetailContentProps = {
  folderId: number | null;
};

function FolderDetailContent({ folderId }: FolderDetailContentProps) {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();

  const folder = MOCK_FOLDERS.find(({ id }) => id === folderId);

  /** 없는 폴더는 안내 후 폴더 탭으로 — 기록에 남기지 않는다 */
  useEffect(() => {
    if (folder) return;

    toast.error('폴더를 찾을 수 없어요.');
    router.replace(ROUTES.WISHLIST_FOLDER_TAB);
  }, [folder, router]);

  if (!folder) return null;

  const wishes = MOCK_WISHES.filter(({ wish }) => folder.wishIds.includes(wish.id));

  return (
    <>
      <div
        className="sticky top-0 bg-bg-layer-basement pt-padding-top"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <div className="pr-5 pl-2.5">
          <Header
            left={
              <button
                type="button"
                aria-label="뒤로가기"
                onClick={() => backWithFallback(ROUTES.WISHLIST_FOLDER_TAB)}
                className="cursor-pointer"
              >
                <ChevronBackwardIconFill className="size-7.5 text-text-neutral-primary" />
              </button>
            }
            center={
              <h1 className="max-w-55 truncate heading-1-bold text-text-neutral-primary">
                {folder.name}
              </h1>
            }
            right={<WishSearchLink />}
          />
        </div>
        <Spacing size={24} />
        <div className="flex items-center justify-between px-5">
          <p className="flex items-center gap-2 body-2-medium text-text-neutral-tertiary">
            {folder.name}
            <span aria-hidden className="h-[12.6px] w-px bg-gray-300" />
            전체({wishes.length})
          </p>
          <button
            type="button"
            className="cursor-pointer body-2-medium text-text-neutral-secondary"
          >
            편집 {/* TODO: 폴더 안 위시 편집 동작 연결 */}
          </button>
        </div>
        <Spacing size={24} />
      </div>
      
      {/* TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: folderId) 추가 */}
      <WishGrid wishes={wishes} />
    </>
  );
}

export default FolderDetailContent;
