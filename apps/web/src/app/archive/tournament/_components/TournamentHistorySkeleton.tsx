import TournamentCardSkeleton from '@/components/tournament-card/TournamentCardSkeleton';

const SKELETON_COUNT = 4;

function TournamentHistorySkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <TournamentCardSkeleton key={index} />
      ))}
    </>
  );
}

export default TournamentHistorySkeleton;
