'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import { LockIconFill } from '@/assets/icons';
import FolderCover from '@/components/common/folder-cover';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import { WISH_TAB } from '../_consts/wishTab';
import FolderMenu from './FolderMenu';

type FolderCardProps = {
  folderId: number;
  name: string;
  wishCount: number;
  /** 앞에서부터 최대 3장 사용 */
  thumbnailUrls: (string | null)[];
  isPublic: boolean;
  onToggleVisibility: () => void;
  onRename: () => void;
  onDelete: () => void;
};

function FolderCard({
  folderId,
  name,
  wishCount,
  thumbnailUrls,
  isPublic,
  onToggleVisibility,
  onRename,
  onDelete,
}: FolderCardProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveScrollAnchor(
      { namespace: SCROLL_NAMESPACE.WISHLIST, scope: WISH_TAB.FOLDER },
      event.currentTarget,
      folderId
    );
  };

  return (
    <div className="relative">
      <Link
        href={ROUTES.WISHLIST_FOLDER(folderId)}
        data-scroll-anchor-id={folderId}
        onClick={handleClick}
        className="flex flex-col"
      >
        <FolderCover thumbnailUrls={thumbnailUrls.slice(0, 3)} />
        <div className="flex flex-col gap-1 py-3 pr-11 pl-3">
          <p className="truncate body-2-medium text-text-neutral-primary">{name}</p>
          <p className="caption-1-regular text-text-neutral-secondary">위시 {wishCount}개</p>
        </div>
      </Link>
      {!isPublic && (
        <div
          className="pointer-events-none absolute top-3 right-3 flex size-[26px] items-center justify-center rounded-full bg-black/30"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
        >
          <LockIconFill aria-hidden className="size-4.5 text-icon-neutral-inverse" />
          <span className="sr-only">비공개 폴더</span>
        </div>
      )}
      <div className="absolute right-3 bottom-[34px] flex">
        <FolderMenu
          folderName={name}
          isPublic={isPublic}
          onToggleVisibility={onToggleVisibility}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default FolderCard;
