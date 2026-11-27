'use client';

import Link from 'next/link';

import { ROUTES } from '@/consts/route';

import { useGetWinnerWishes } from '../_common/_hooks/useGetWinnerWishes';
import ExploreSectionHeader from './ExploreSectionHeader';
import WinnerWishThumbnailCard from './WinnerWishThumbnailCard';

/** 가로 스크롤에 노출할 최대 개수 */
const MAX_COUNT = 20;

function WinnerWishSection() {
  const { winnerWishesData } = useGetWinnerWishes();

  return (
    <section className="flex flex-col gap-4">
      <ExploreSectionHeader
        title="남들은 뭘 골랐을까?"
        description="토너먼트에서 1위를 차지한 위시를 모았어요"
        moreHref={ROUTES.EXPLORE_WINNERS}
      />
      <ul className="hide-scrollbar flex gap-2.5 overflow-x-auto px-5">
        {winnerWishesData.slice(0, MAX_COUNT).map(({ wishId, item }, index) => (
          <li key={wishId} className="w-[133px] shrink-0">
            <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
              <WinnerWishThumbnailCard item={item} preload={index < 3} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WinnerWishSection;
