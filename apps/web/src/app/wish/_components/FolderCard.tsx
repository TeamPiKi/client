'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import BaseImage from '@/components/base-image';
import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import FolderCoverEmptyImage from '../_assets/folder-cover-empty.svg';
import { WISH_TAB } from '../_consts/wishTab';
import FolderMenu from './FolderMenu';

type FolderCardProps = {
  folderId: number;
  name: string;
  wishCount: number;
  /** 앞에서부터 최대 3장 사용 */
  thumbnailUrls: (string | null)[];
  onRename: () => void;
  onDelete: () => void;
};

function FolderThumbnail({ url, className }: { url: string | null; className?: string }) {
  return (
    <div className={cn('relative bg-gray-75', className)}>
      {url && (
        <BaseImage
          src={url}
          alt=""
          sizes="(max-width: 480px) 50vw, 240px"
          className="object-cover"
        />
      )}
    </div>
  );
}

function FolderCover({ thumbnailUrls }: Pick<FolderCardProps, 'thumbnailUrls'>) {
  const [first = null, second = null, third = null] = thumbnailUrls;

  if (thumbnailUrls.length === 0)
    return (
      <div className="flex aspect-[201/248] w-full items-center justify-center bg-bg-layer-basement">
        <FolderCoverEmptyImage width={58} height={43} aria-hidden />
      </div>
    );

  if (thumbnailUrls.length === 1)
    return <FolderThumbnail url={first} className="aspect-[201/248] w-full" />;

  return (
    <div className="grid aspect-[201/248] w-full grid-cols-2 grid-rows-2">
      <FolderThumbnail
        url={first}
        className="col-span-2 border-b-[1.5px] border-bg-layer-basement"
      />
      <FolderThumbnail url={second} />
      {thumbnailUrls.length === 2 ? (
        <div className="flex items-center justify-center border-l-[1.5px] border-bg-layer-basement bg-bg-layer-basement">
          <FolderCoverEmptyImage width={41} height={30} aria-hidden />
        </div>
      ) : (
        <FolderThumbnail url={third} className="border-l-[1.5px] border-bg-layer-basement" />
      )}
    </div>
  );
}

function FolderCard({
  folderId,
  name,
  wishCount,
  thumbnailUrls,
  onRename,
  onDelete,
}: FolderCardProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveScrollAnchor(
      { namespace: SCROLL_NAMESPACE.WISH, scope: WISH_TAB.FOLDER },
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
      <div className="absolute right-3 bottom-[34px] flex">
        <FolderMenu folderName={name} onRename={onRename} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default FolderCard;
