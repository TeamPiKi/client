'use client';

import { notFound } from 'next/navigation';

import { Header, HeaderIcon } from '@/components/header';

import PickHeartButton from '../../../_common/_components/PickHeartButton';
import WinnerWishGridCard from '../../_components/WinnerWishGridCard';
import { useGetTournamentCandidates } from '../_hooks/useGetTournamentCandidates';

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 4;

type TournamentCandidatesContentProps = {
  pickId: number;
};

function TournamentCandidatesContent({ pickId }: TournamentCandidatesContentProps) {
  const { tournamentCandidatesData } = useGetTournamentCandidates(pickId);

  /** 레이아웃이 없는 1위를 걸러 내지만 타입상 null 이 남아 한 번 더 막음 */
  if (!tournamentCandidatesData) notFound();

  const { tournament, candidates } = tournamentCandidatesData;

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">{tournament.title}</h1>}
      />

      <ul className="mt-6 grid grid-cols-2">
        {candidates.map(({ candidateId, item, isWinner, isInMyWish }, index) => (
          <li key={candidateId} className="relative">
            <WinnerWishGridCard item={item} isWinner={isWinner} preload={index < PRELOAD_COUNT} />
            <PickHeartButton pickId={pickId} candidateId={candidateId} isInMyWish={isInMyWish} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default TournamentCandidatesContent;
