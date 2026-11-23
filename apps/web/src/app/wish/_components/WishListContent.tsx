'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { foldersQueryOptions } from '@/apis/getFolders';
import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { wishesCountQueryOptions } from '@/apis/getWishesCount';
import BaseImage from '@/components/base-image';
import CollapsibleTitle from '@/components/common/collapsible-title';
import PullToRefresh from '@/components/common/pull-to-refresh';
import UnderlineTab from '@/components/common/underline-tab';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { useGetWishesCount } from '@/hooks/useGetWishesCount';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import type { FolderT } from '@/types/folder';
import { cn } from '@/utils/cn';
import { refetchFirstPage } from '@/utils/refetchFirstPage';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import WishEditActionBar from '../_common/_components/WishEditActionBar';
import WishEditHeader from '../_common/_components/WishEditHeader';
import { WISH_MODE } from '../_common/_consts/wishMode';
import { useDeleteWishes } from '../_common/_hooks/useDeleteWishes';
import { usePostFolderWishes } from '../_common/_hooks/usePostFolderWishes';
import { useWishEditMode } from '../_common/_hooks/useWishEditMode';
import { WISH_TAB, WISH_TABS, WISH_TAB_PANEL_ID, WISH_TAB_PATH } from '../_consts/wishTab';
import { useShareIntentWish } from '../_hooks/useShareIntentWish';
import type { WishTabT } from '../_types/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';
import WishSearch from './WishSearch';
import WishTabContent from './WishTabContent';
import WishTabSummary from './WishTabSummary';

function WishListContent() {
  const searchParams = useSearchParams();
  const activeTab = parseWishTabParam(searchParams.get('tab'));
  const isFolderTab = activeTab === WISH_TAB.FOLDER;
  const { userData } = useGetMe();

  const handleTabChange = (tab: WishTabT) => {
    if (tab !== activeTab) replaceUrlKeepingState(WISH_TAB_PATH[tab]);
  };

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

  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(
    () =>
      isFolderTab
        ? queryClient.refetchQueries(
            { queryKey: foldersQueryOptions.queryKey },
            { throwOnError: true }
          )
        : Promise.all([
            refetchFirstPage(queryClient, wishesInfiniteQueryOptions().queryKey),
            queryClient.refetchQueries(
              { queryKey: wishesCountQueryOptions().queryKey },
              { throwOnError: true }
            ),
          ]),
    { enabled: mode !== WISH_MODE.EDIT }
  );

  return (
    <>
      <div
        className={cn(
          'sticky top-0 flex flex-col gap-6 bg-bg-layer-default px-5 pt-padding-top',
          !isFolderTab && 'pb-6'
        )}
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        {mode === WISH_MODE.EDIT ? (
          <WishEditHeader selectedCount={selectedWishIds.size} onDone={handleExitEditMode} />
        ) : (
          <>
            <CollapsibleTitle
              title="내 위시리스트"
              right={
                userData.identityType === 'MEMBER' && (
                  <Link
                    href={ROUTES.PROFILE(userData.id)}
                    aria-label="내 프로필"
                    className="flex size-[30px] shrink-0 items-center justify-center"
                  >
                    <span className="relative size-6 overflow-hidden rounded-full">
                      <BaseImage
                        src={userData.profileImage}
                        alt=""
                        sizes="24px"
                        className="object-cover"
                        loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
                      />
                    </span>
                  </Link>
                )
              }
            />
            <div>
              <UnderlineTab
                tabs={WISH_TABS}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                idPrefix="wish-tab"
                panelId={WISH_TAB_PANEL_ID}
              />
              <PullToRefresh {...pullToRefresh} />
            </div>
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
