'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { ROUTES } from '@/consts/route';

import LoadingCharacter from './_components/LoadingCharacter';
import LoadingStepCard from './_components/LoadingStepCard';
import LoadingStepTitle from './_components/LoadingStepTitle';
import useLoadingStep from './_hooks/useLoadingStep';
import usePreloadMatchResources from './_hooks/usePreloadMatchResources';

function TournamentLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = Number(params.id);

  const { progress, isComplete } = usePreloadMatchResources(tournamentId);

  const handleDone = useCallback(() => {
    router.replace(ROUTES.TOURNAMENT_MATCH(tournamentId));
  }, [router, tournamentId]);

  const { step, barProgress } = useLoadingStep({ progress, isComplete, onDone: handleDone });

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
