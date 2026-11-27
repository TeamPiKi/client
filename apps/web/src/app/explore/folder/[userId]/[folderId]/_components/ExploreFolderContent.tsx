'use client';

import Link from 'next/link';

import { Header, HeaderIcon } from '@/components/header';
import { ROUTES } from '@/consts/route';

import WishHeartButton from '../../../../_common/_components/WishHeartButton';
import { useGetExploreFolder } from '../_hooks/useGetExploreFolder';
import FolderEmptyState from './FolderEmptyState';
import FolderWishGridCard from './FolderWishGridCard';

const PRELOAD_COUNT = 4;

type ExploreFolderContentProps = {
  userId: string;
  folderId: number;
};

function ExploreFolderContent({ userId, folderId }: ExploreFolderContentProps) {
  const { exploreFolderData } = useGetExploreFolder(userId, folderId);

  return (
    <>
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={
          exploreFolderData && (
            <h1 className="truncate heading-1-bold text-text-neutral-primary">
              {exploreFolderData.name}
            </h1>
          )
        }
      />

      {exploreFolderData ? (
        <ul className="mt-6 grid grid-cols-2">
          {exploreFolderData.wishes.map(({ wishId, item, isInMyWish }, index) => (
            <li key={wishId} className="relative">
              <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
                <FolderWishGridCard item={item} preload={index < PRELOAD_COUNT} />
              </Link>
              <WishHeartButton wishId={wishId} isInMyWish={isInMyWish} />
            </li>
          ))}
        </ul>
      ) : (
        <FolderEmptyState />
      )}
    </>
  );
}

export default ExploreFolderContent;
