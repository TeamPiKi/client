import TournamentCandidatesContent from './_components/TournamentCandidatesContent';

type TournamentCandidatesPageProps = {
  params: Promise<{ tournamentId: string }>;
};

async function TournamentCandidatesPage({ params }: TournamentCandidatesPageProps) {
  const { tournamentId } = await params;

  return <TournamentCandidatesContent tournamentId={Number(tournamentId)} />;
}

export default TournamentCandidatesPage;
