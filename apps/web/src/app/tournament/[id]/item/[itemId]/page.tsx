import TournamentItemInfoScreen from './_components/TournamentItemInfoScreen';

type TournamentItemInfoPageProps = {
  params: Promise<{ id: string; itemId: string }>;
};

async function TournamentItemInfoPage({ params }: TournamentItemInfoPageProps) {
  const { id, itemId } = await params;
  const tournamentId = Number(id);
  const tournamentItemId = Number(itemId);

  return (
    <TournamentItemInfoScreen tournamentId={tournamentId} tournamentItemId={tournamentItemId} />
  );
}

export default TournamentItemInfoPage;
