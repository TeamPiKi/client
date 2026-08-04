import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getQueryClient } from '@/utils/queryClient';

import { getTournament } from '../_common/_apis/getTournament';
import type { GetTournamentInProgressResponseT } from '../_common/_types/tournamentResponse';
import { postStartTournament } from './_apis/postStartTournament';
import TournamentClient from './_components/TournamentClient';

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentPage({ params }: TournamentPageProps) {
  const { id } = await params;
  const tournamentId = Number(id);

  const tournamentData = await getTournament(tournamentId);

  if (tournamentData.status === 'COMPLETED') {
    redirect(ROUTES.TOURNAMENT_RESULT(tournamentId));
  }

  // 참여자가 본인 매치를 시작하기 전 (IN_PROGRESS + pending 페이로드)
  // — 아직 진행할 게 없으므로 create(대기) 화면으로 돌려보낸다.
  if (tournamentData.status === 'IN_PROGRESS' && tournamentData.pending) {
    redirect(ROUTES.TOURNAMENT_CREATE(tournamentId));
  }

  let hydratedTournament: GetTournamentInProgressResponseT;
  let playTournamentId = tournamentId;

  if (tournamentData.status === 'PENDING') {
    try {
      // 응답 tournamentId 활용:
      // - 주최자(ROOT): 요청 tournamentId 와 동일
      // - 참여자(CLONE): 새로 생성된 CLONE id (이후 본인 인스턴스로 진행)
      const { tournamentId: nextTournamentId } = await postStartTournament(tournamentId);

      // CLONE 이 생성됐다면 본인 인스턴스 URL 로 이동 (재진입 시 IN_PROGRESS 분기로 흘러감)
      if (nextTournamentId !== tournamentId) {
        redirect(ROUTES.TOURNAMENT_MATCH(nextTournamentId));
      }

      // start 응답에는 브래킷(currentMatch)이 없어 서버 권위 상태를 다시 받는다.
      // RSC 내부 왕복이라 브라우저 지연이 아니고, 아래 409 복구 경로와 같은 패턴이다.
      playTournamentId = nextTournamentId;
      const started = await getTournament(nextTournamentId);

      if (started.status === 'COMPLETED') {
        redirect(ROUTES.TOURNAMENT_RESULT(nextTournamentId));
      }
      if (started.status !== 'IN_PROGRESS' || started.pending) {
        // start 직후인데 진행 상태가 아님 — 예상 밖이라 대기 화면으로 돌려보낸다
        redirect(ROUTES.TOURNAMENT_CREATE(nextTournamentId));
      }

      hydratedTournament = started;
    } catch (error) {
      // 409: 다른 탭/요청이 먼저 start 호출한 경우 — 서버 권위 상태로 복구
      if (!isAxiosError(error) || error.response?.status !== 409) throw error;

      const latest = await getTournament(tournamentId);
      if (latest.status === 'COMPLETED') {
        redirect(ROUTES.TOURNAMENT_RESULT(tournamentId));
      }
      if (latest.status === 'PENDING' || latest.pending) {
        // 409이면서 여전히 PENDING 또는 멤버 대기 상태 — 예상 밖, 그대로 던짐
        throw error;
      }
      hydratedTournament = latest;
    }
  } else {
    // tournamentData.status === 'IN_PROGRESS' && !tournamentData.pending — 매치 진행 중
    hydratedTournament = tournamentData;
  }

  const queryClient = getQueryClient();
  queryClient.setQueryData(['tournament', playTournamentId], hydratedTournament);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TournamentClient
        tournamentId={playTournamentId}
        tournamentName={hydratedTournament.name}
        inProgress={hydratedTournament.inProgress}
      />
    </HydrationBoundary>
  );
}

export default TournamentPage;
