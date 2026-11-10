'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ROUTES } from '@/consts/route';
import { TOURNAMENT_STATUS } from '@/consts/tournament';

import usePreloadMatchImages from '../_common/_hooks/usePreloadMatchImages';
import type { GetTournamentResponseT } from '../_common/_types/tournamentResponse';
import LoadingCharacter from './_components/LoadingCharacter';
import LoadingStepCard from './_components/LoadingStepCard';
import LoadingStepTitle from './_components/LoadingStepTitle';
import useLoadingStep from './_hooks/useLoadingStep';

const LOADING_DURATION_MS = 4000;

const getCandidateImageUrls = (tournament: GetTournamentResponseT | undefined) => {
  if (!tournament) return [];
  if (tournament.status === TOURNAMENT_STATUS.PENDING)
    return tournament.pending.items.map(item => item.imageUrl);
  if (tournament.status !== TOURNAMENT_STATUS.IN_PROGRESS) return [];

  return tournament.inProgress
    ? tournament.inProgress.remainingItems.map(item => item.imageUrl)
    : tournament.pending.items.map(item => item.imageUrl);
};

function TournamentLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const tournamentId = Number(params.id);

  const tournamentData = queryClient.getQueryData<GetTournamentResponseT>([
    'tournament',
    tournamentId,
  ]);

  usePreloadMatchImages(getCandidateImageUrls(tournamentData));

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsComplete(true), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDone = useCallback(() => {
    router.replace(ROUTES.TOURNAMENT_MATCH(tournamentId));
  }, [router, tournamentId]);

  const { step, barProgress } = useLoadingStep({ isComplete, onDone: handleDone });

  return (
    <main className="flex min-h-dvh flex-col justify-center bg-linear-to-b from-white to-[#a2deff] px-5 pt-padding-top pb-6">
      <LoadingStepTitle step={step} />

      <div className="mt-[26px]">
        <LoadingStepCard step={step} barProgress={barProgress} />
      </div>

      <div className="mt-[17px]">
        <LoadingCharacter />
      </div>
    </main>
  );
}

export default TournamentLoadingPage;
