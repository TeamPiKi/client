'use client';

import type { GetTournamentInProgressResponseT } from '../../_common/_types/tournamentResponse';
import usePreloadMatchImages from '../_hooks/usePreloadMatchImages';
import useTournament from '../_hooks/useTournament';
import MatchSkeleton from './MatchSkeleton';
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
    remainingItems,
    roundLabel,
    isFinalRound,
    transitionStage,
    selectionEpoch,
    isRecordingMatch,
    handleSelect,
    handleTransitionComplete,
  } = useTournament({ tournamentId, tournamentName, inProgress });

  // 다음 대진은 미리 알 수 없어도 후보는 알고 있다 — 라운드의 남은 아이템 이미지를 미리 받아둔다
  usePreloadMatchImages(remainingItems.map(item => item.imageUrl));

  const backgroundClassName = isFinalRound
    ? 'bg-gradient-to-b from-sky-blue-50 via-[#F5FCFF] to-white'
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
        {/* 다음 매치는 서버 응답으로 오므로 기록 대기 동안 스켈레톤을 보여준다 */}
        {isRecordingMatch || !currentMatch ? (
          <MatchSkeleton isFinal={isFinalRound} />
        ) : (
          <VsSection
            // 매치가 바뀌면 remount — selectionEpoch 는 기록 실패 시 카드 선택 락을 푸는 용도
            key={`${currentMatch.first.tournamentItemId}-${currentMatch.second.tournamentItemId}-${selectionEpoch}`}
            left={currentMatch.first}
            right={currentMatch.second}
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
