import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';

import { getTournamentList } from '@/apis/getTournamentList';
import { ChevronForwardIconFill } from '@/assets/icons';
import TournamentCardSkeleton from '@/components/tournament-card/TournamentCardSkeleton';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { ROUTES } from '@/consts/route';
import { getQueryClient } from '@/utils/queryClient';

import TournamentListClient from './client';

function TournamentList() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS({ limit: 3, ownedOnly: true }),
    queryFn: () => getTournamentList({ limit: 3, ownedOnly: true }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="heading-2-semibold text-black">최근 토너먼트</h2>
          <Link href={ROUTES.TOURNAMENT_HISTORY} aria-label="토너먼트 히스토리 보기">
            <ChevronForwardIconFill className="size-6 text-icon-neutral-secondary" aria-hidden />
          </Link>
        </div>

        <Suspense
          fallback={
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <TournamentCardSkeleton key={index} />
              ))}
            </>
          }
        >
          <TournamentListClient />
        </Suspense>
      </section>
    </HydrationBoundary>
  );
}

export default TournamentList;
