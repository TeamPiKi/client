import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMe } from '@/apis/getMe';
import { getQueryClient } from '@/utils/queryClient';

import TournamentCreateClient from './_components/TournamentCreateClient';

type TournamentCreatePageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentCreatePage({ params }: TournamentCreatePageProps) {
  const { id } = await params;
  const tournamentId = Number(id);
  const queryClient = getQueryClient();

  // ['tournament', id] 는 상위 layout 이 이미 조회·시드하므로 중복 prefetch 하지 않는다.
  // me 는 await 하지 않음 — pending dehydrate 스트리밍 (전환 논블로킹)
  void queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TournamentCreateClient tournamentId={tournamentId} />
    </HydrationBoundary>
  );
}

export default TournamentCreatePage;
