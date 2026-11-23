'use client';

import Link from 'next/link';

import { ROUTES } from '@/consts/route';

import { useGetFriendWishes } from '../_common/_hooks/useGetFriendWishes';
import ExploreSectionHeader from './ExploreSectionHeader';
import FriendWishThumbnailCard from './FriendWishThumbnailCard';

const MAX_COUNT = 20;

function FriendWishSection() {
  const { friendWishesData } = useGetFriendWishes();

  if (friendWishesData.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <ExploreSectionHeader
        title="친구가 담은 위시"
        description="친구들의 취향을 참고해 보세요"
        moreHref={ROUTES.EXPLORE_FRIENDS}
      />
      <ul className="hide-scrollbar flex gap-2.5 overflow-x-auto px-5">
        {friendWishesData.slice(0, MAX_COUNT).map(({ wishId, item, friend }) => (
          <li key={wishId} className="w-[133px] shrink-0">
            <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
              <FriendWishThumbnailCard item={item} friend={friend} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FriendWishSection;
