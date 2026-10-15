'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import BaseImage from '@/components/base-image';
import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import { WISH_TAB } from '../_consts/wishTab';

type FolderCardProps = {
  folderId: number;
  name: string;
  wishCount: number;
  /** 앞에서부터 최대 3장 사용 */
  thumbnailUrls: (string | null)[];
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

function FolderCard({ folderId, name, wishCount, thumbnailUrls }: FolderCardProps) {
  const [first = null, second = null, third = null] = thumbnailUrls;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveScrollAnchor(
      { namespace: SCROLL_NAMESPACE.WISH, scope: WISH_TAB.FOLDER },
      event.currentTarget,
      folderId
    );
  };

  return (
    <Link
      href={ROUTES.WISHLIST_FOLDER(folderId)}
      data-scroll-anchor-id={folderId}
      onClick={handleClick}
      className="flex flex-col"
    >
      <div className="grid aspect-[201/248] w-full grid-cols-2 grid-rows-2">
        <FolderThumbnail
          url={first}
          className="col-span-2 border-b-[1.5px] border-bg-layer-basement"
        />
        <FolderThumbnail url={second} />
        <FolderThumbnail url={third} className="border-l-[1.5px] border-bg-layer-basement" />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate body-2-medium text-text-neutral-primary">{name}</p>
        <p className="caption-1-regular text-text-neutral-secondary">위시 {wishCount}개</p>
      </div>
    </Link>
  );
}

export default FolderCard;
