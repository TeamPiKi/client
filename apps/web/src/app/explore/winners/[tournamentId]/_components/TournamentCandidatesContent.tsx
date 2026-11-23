'use client';

import { notFound } from 'next/navigation';

import { Header, HeaderIcon } from '@/components/header';

import WinnerWishGridCard from '../../_components/WinnerWishGridCard';
import { useGetTournamentCandidates } from '../_hooks/useGetTournamentCandidates';

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 4;

type TournamentCandidatesContentProps = {
  tournamentId: number;
};

function TournamentCandidatesContent({ tournamentId }: TournamentCandidatesContentProps) {
  const { tournamentCandidatesData } = useGetTournamentCandidates(tournamentId);

  /** 레이아웃이 없는 토너먼트를 걸러 내지만 타입상 null 이 남아 한 번 더 막음 */
  if (!tournamentCandidatesData) notFound();

  const { tournament, candidates } = tournamentCandidatesData;
  /** 1위 상품을 가장 먼저 노출 — TODO: 서버가 1위를 맨 앞에 담아 주기로 하면 정렬 제거 */
  const sortedCandidates = [...candidates].sort((a, b) => Number(b.isWinner) - Number(a.isWinner));

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">{tournament.title}</h1>}
      />

      <ul className="mt-6 grid grid-cols-2">
        {sortedCandidates.map(({ wishId, item, isWinner }, index) => (
          <li key={wishId}>
            <WinnerWishGridCard item={item} isWinner={isWinner} preload={index < PRELOAD_COUNT} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default TournamentCandidatesContent;
