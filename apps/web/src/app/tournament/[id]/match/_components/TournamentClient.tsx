'use client';

import usePreloadMatchImages from '../../_common/_hooks/usePreloadMatchImages';
import type { GetTournamentInProgressResponseT } from '../../_common/_types/tournamentResponse';
import matchBackground from '../_assets/match-background.jpg';
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
    handleSelect,
    handleTransitionComplete,
  } = useTournament({ tournamentId, tournamentName, inProgress });

  // 다음 대진은 미리 알 수 없어도 후보는 알고 있다 — 라운드의 남은 아이템 이미지를 미리 받아둔다
  usePreloadMatchImages(remainingItems.map(item => item.imageUrl));

  return (
    <main className="relative hide-scrollbar flex min-h-dvh flex-col items-center overflow-y-auto px-5 pt-padding-top pb-6">
      {/** 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#A2DEFF]">
        <div
          className="absolute inset-0 bg-cover opacity-40"
          /** NOTE: 이미지가 프레임 왼쪽 위로 밀려 있어, 그 지점을 비율로 고정해 항상 같은 이미지 부분이 보이게 함 */
          style={{ backgroundImage: `url(${matchBackground.src})`, backgroundPosition: '15% 51%' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/0 to-white" />
      </div>

      <div className="relative mt-6 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <RoundBadge label={roundLabel} isFinal={isFinalRound} />
          <TournamentQuestion isFinal={isFinalRound} />
        </div>
        {isFinalRound && (
          <p className="heading-2-medium text-text-neutral-secondary">최종 선택을 해주세요</p>
        )}
      </div>
      <div className={`relative -mx-5 ${isFinalRound ? 'mt-29' : 'mt-8'}`}>
        {/* 기록 대기 중에는 이전 화면을 유지해 스켈레톤 깜빡임을 방지한다. */}
        {!currentMatch ? (
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
