'use client';

import Link from 'next/link';

import { ROUTES } from '@/consts/route';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import { useGetWinnerWishes } from '../_common/_hooks/useGetWinnerWishes';
import ExploreSectionHeader from './ExploreSectionHeader';
import WinnerWishThumbnailCard from './WinnerWishThumbnailCard';

/** 가로 스크롤에 노출할 최대 개수 */
const MAX_COUNT = 20;

function WinnerWishSection() {
  const { winnerWishesData } = useGetWinnerWishes();

  if (winnerWishesData.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <ExploreSectionHeader
        title="남들은 뭘 골랐을까?"
        description="토너먼트에서 1위를 차지한 위시를 모았어요"
        moreHref={ROUTES.EXPLORE_WINNERS}
      />
      <ul className="hide-scrollbar flex gap-2.5 overflow-x-auto px-5">
        {winnerWishesData.slice(0, MAX_COUNT).map(({ pickId, item }, index) => (
          <li key={pickId} className="w-[133px] shrink-0">
            <Link
              href={ROUTES.EXPLORE_PICK(pickId)}
              data-scroll-anchor-id={`winner-${pickId}`}
              onClick={event =>
                saveScrollAnchor(
                  { namespace: SCROLL_NAMESPACE.EXPLORE },
                  event.currentTarget,
                  `winner-${pickId}`
                )
              }
              className="block"
            >
              <WinnerWishThumbnailCard item={item} preload={index < 3} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WinnerWishSection;
