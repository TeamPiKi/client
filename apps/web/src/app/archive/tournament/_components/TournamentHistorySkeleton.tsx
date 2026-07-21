import TournamentCardSkeleton from '@/components/tournament-card/TournamentCardSkeleton';

const SKELETON_COUNT = 4;

function TournamentHistorySkeleton() {
  return (
    <main className="flex flex-1 flex-col gap-4 pt-6 pb-24">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <TournamentCardSkeleton key={index} />
      ))}
    </main>
  );
}

export default TournamentHistorySkeleton;
