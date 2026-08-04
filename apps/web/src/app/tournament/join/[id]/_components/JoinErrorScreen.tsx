import TournamentErrorDialog from '@/components/tournament-error-dialog';
import type { TournamentErrorTypeT } from '@/types/tournament';

type JoinErrorScreenProps = {
  type: TournamentErrorTypeT;
};

/** 토너먼트 참여 불가 안내 화면 */
function JoinErrorScreen({ type }: JoinErrorScreenProps) {
  return (
    <>
      <main className="min-h-dvh bg-bg-layer-default" />
      <TournamentErrorDialog type={type} />
    </>
  );
}

export default JoinErrorScreen;
