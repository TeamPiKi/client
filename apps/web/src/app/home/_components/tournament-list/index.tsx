import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';

import { getTournamentList } from '@/apis/getTournamentList';
import { ChevronForwardIconFill } from '@/assets/icons';
import TournamentCardSkeleton from '@/components/tournament-card/TournamentCardSkeleton';
import { ROUTES } from '@/consts/route';
import type { TournamentStatusT } from '@/types/tournament';
import { getQueryClient } from '@/utils/queryClient';

import TournamentListClient from './client';

const TOURNAMENT_LIST_STATUS: TournamentStatusT[] = ['PENDING', 'IN_PROGRESS'];
const TOURNAMENT_LIST_LIMIT = 3;

function TournamentList() {
  const queryClient = getQueryClient();

  // 클라이언트(useGetTournamentList) 와 동일한 키·limit 로 프리패치해야 hydration 캐시가 재사용된다
  queryClient.prefetchQuery({
    queryKey: ['tournamentList', TOURNAMENT_LIST_STATUS, TOURNAMENT_LIST_LIMIT],
    queryFn: () => getTournamentList(TOURNAMENT_LIST_STATUS, TOURNAMENT_LIST_LIMIT),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="heading-2-semibold text-black">최근 생성한 토너먼트</h2>
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
          <TournamentListClient statuses={TOURNAMENT_LIST_STATUS} limit={TOURNAMENT_LIST_LIMIT} />
        </Suspense>
      </section>
    </HydrationBoundary>
  );
}

export default TournamentList;
