'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/consts/route';

import LoadingBar from './_components/LoadingBar';
import TournamentBracketAnimation from './_components/TournamentBracketAnimation';

const LOADING_DURATION_MS = 4000;

function TournamentLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = Number(params.id);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(ROUTES.TOURNAMENT_MATCH(tournamentId));
    }, LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router, tournamentId]);

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5 pt-padding-top pb-6">
      <header className="flex flex-col gap-2 text-center tracking-[-0.6px]">
        <h1 className="text-[24px] leading-8 font-bold text-text-neutral-primary">
          대진표 만드는 중...
        </h1>
        <p className="heading-2-medium text-text-neutral-tertiary">
          비슷한 가격대 상품끼리 대진표를 짜고 있어요
        </p>
      </header>

      <div className="mt-11">
        <LoadingBar />
      </div>

      <div className="mt-20">
        <TournamentBracketAnimation />
      </div>
    </main>
  );
}

export default TournamentLoadingPage;
