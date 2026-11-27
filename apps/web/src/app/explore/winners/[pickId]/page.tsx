import TournamentCandidatesContent from './_components/TournamentCandidatesContent';

type TournamentCandidatesPageProps = {
  params: Promise<{ pickId: string }>;
};

async function TournamentCandidatesPage({ params }: TournamentCandidatesPageProps) {
  const { pickId } = await params;

  return <TournamentCandidatesContent pickId={Number(pickId)} />;
}

export default TournamentCandidatesPage;
