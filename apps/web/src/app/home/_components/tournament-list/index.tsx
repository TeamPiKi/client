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

function TournamentList() {
  const queryClient = getQueryClient();

  // await 하지 않음 — pending dehydrate 스트리밍. 홈 재방문 시 클라 캐시로 즉시 렌더
  void queryClient.prefetchQuery({
    queryKey: ['tournamentList', TOURNAMENT_LIST_STATUS],
    queryFn: () => getTournamentList(TOURNAMENT_LIST_STATUS),
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
          <TournamentListClient statuses={TOURNAMENT_LIST_STATUS} />
        </Suspense>
      </section>
    </HydrationBoundary>
  );
}

export default TournamentList;
