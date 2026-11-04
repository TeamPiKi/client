'use client';

import usePreloadMatchImages from '../../_common/_hooks/usePreloadMatchImages';
import type { GetTournamentInProgressResponseT } from '../../_common/_types/tournamentResponse';
import matchBackground from '../_assets/match-background.jpg';
import useTournament from '../_hooks/useTournament';
import MatchBadge from './MatchBadge';
import MatchHeader from './MatchHeader';
import MatchSkeleton from './MatchSkeleton';
import MatchTitle from './MatchTitle';
import RoundTicker from './RoundTicker';
import RoundTransitionSheet from './RoundTransitionSheet';
import VsSection from './VsSection';

type TournamentClientProps = {
  tournamentId: number;
  tournamentName: string;
  inProgress: GetTournamentInProgressResponseT['inProgress'];
};

function TournamentClient({ tournamentId, tournamentName, inProgress }: TournamentClientProps) {
  const {
    currentMatch,
    remainingItems,
    currentRound,
    matchIndex,
    isFinalRound,
    transitionStage,
    selectionEpoch,
    handleSelect,
    handleTransitionComplete,
  } = useTournament({ tournamentId, tournamentName, inProgress });

  // 다음 대진은 미리 알 수 없어도 후보는 알고 있다 — 라운드의 남은 아이템 이미지를 미리 받아둔다
  usePreloadMatchImages(remainingItems.map(item => item.imageUrl));

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/** 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#A2DEFF]">
        <div
          className="absolute inset-0 bg-cover opacity-40"
          /** NOTE: 이미지가 프레임 왼쪽 위로 밀려 있어, 그 지점을 비율로 고정해 항상 같은 이미지 부분이 보이게 함 */
          style={{ backgroundImage: `url(${matchBackground.src})`, backgroundPosition: '15% 51%' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/0 to-white" />
      </div>

      <div className="relative flex flex-col">
        <MatchHeader />
        <RoundTicker currentRound={currentRound} isFinal={isFinalRound} />
      </div>

      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-[50px] pb-[calc(var(--spacing-padding-top)+90px)]">
        <div className="flex flex-col items-center gap-4">
          <MatchBadge matchIndex={matchIndex} isFinal={isFinalRound} />
          <MatchTitle isFinal={isFinalRound} />
        </div>

        <div className="w-full">
          {!currentMatch ? (
            <MatchSkeleton />
          ) : (
            <VsSection
              key={`${currentMatch.first.tournamentItemId}-${currentMatch.second.tournamentItemId}-${selectionEpoch}`}
              left={currentMatch.first}
              right={currentMatch.second}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {transitionStage && (
        <RoundTransitionSheet stage={transitionStage} onComplete={handleTransitionComplete} />
      )}
    </main>
  );
}

export default TournamentClient;
