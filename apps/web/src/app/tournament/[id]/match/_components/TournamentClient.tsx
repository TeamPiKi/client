'use client';

import type { GetTournamentInProgressResponseT } from '../../_common/_types/tournamentResponse';
import useTournament from '../_hooks/useTournament';
import RoundBadge from './RoundBadge';
import RoundTransitionSheet from './RoundTransitionSheet';
import TournamentQuestion from './TournamentQuestion';
import VsSection from './VsSection';

type TournamentClientProps = {
  tournamentId: number;
  tournamentName: string;
  inProgress: GetTournamentInProgressResponseT['inProgress'];
};

function TournamentClient({ tournamentId, tournamentName, inProgress }: TournamentClientProps) {
  const {
    currentMatch,
    roundLabel,
    isFinalRound,
    transitionStage,
    selectionEpoch,
    handleSelect,
    handleTransitionComplete,
  } = useTournament({ tournamentId, tournamentName, inProgress });

  const backgroundClassName = isFinalRound
    ? 'bg-gradient-to-b from-[#ECF3FE] via-[#F3F7FE] to-white'
    : 'bg-bg-layer-basement';

  return (
    <main
      className={`hide-scrollbar flex min-h-dvh flex-col items-center overflow-y-auto px-5 pt-padding-top pb-6 ${backgroundClassName}`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <RoundBadge label={roundLabel} isFinal={isFinalRound} />
          <TournamentQuestion isFinal={isFinalRound} />
        </div>
        {isFinalRound && (
          <p className="heading-2-medium text-text-neutral-secondary">최종 선택을 해주세요</p>
        )}
      </div>
      <div className={`w-full ${isFinalRound ? 'mt-29' : 'mt-8'}`}>
        {currentMatch && (
          <VsSection
            // selectionEpoch: 기록 실패 시 remount 로 카드 선택 락을 풀어 재선택 가능하게 한다
            key={`${roundLabel}-${selectionEpoch}`}
            left={currentMatch[0]}
            right={currentMatch[1]}
            isFinal={isFinalRound}
            onSelect={handleSelect}
          />
        )}
      </div>

      {transitionStage && (
        <RoundTransitionSheet stage={transitionStage} onComplete={handleTransitionComplete} />
      )}
    </main>
  );
}

export default TournamentClient;
