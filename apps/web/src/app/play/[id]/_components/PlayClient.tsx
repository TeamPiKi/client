'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { postGuestLogin } from '@/app/login/_apis/postGuestLogin';
import { getTournament } from '@/app/tournament/[id]/_common/_apis/getTournament';
import Button from '@/components/button';
import Spinner from '@/components/spinner';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';

import { postFromPlayLink } from '../_apis/postFromPlayLink';

type PlayClientProps = {
  sourceTournamentId: number;
};

type PlayStateT = 'loading' | 'expired';

function PlayClient({ sourceTournamentId }: PlayClientProps) {
  const router = useRouter();
  const [state, setState] = useState<PlayStateT>('loading');
  const hasRunRef = useRef(false);

  useEffect(() => {
    // StrictMode/dev double-invoke 방지
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // 게스트가 공유받은 링크로 진입한 시점 — 외부 유입률 측정용.
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_VISIT, { source_tournament_id: sourceTournamentId });

    // CLONE 의 status 에 따라 적절한 화면으로 라우팅한다.
    // - PENDING: 아직 본인 매치를 시작 안 한 상태 → create (바구니 미리보기 + 시작 버튼)
    // - IN_PROGRESS: 매치 진행 중 → match 로 이어서
    // - COMPLETED: 이미 끝낸 토너먼트 (재진입) → result 로 결과 다시 보기
    const goToTournament = async (id: number) => {
      const data = await getTournament(id);
      if (data.status === 'COMPLETED') {
        router.replace(ROUTES.TOURNAMENT_RESULT(id));
        return;
      }
      if (data.status === 'IN_PROGRESS' && !data.pending) {
        router.replace(ROUTES.TOURNAMENT_MATCH(id));
        return;
      }
      router.replace(ROUTES.TOURNAMENT_CREATE(id));
    };

    /**
     * 인증 누락으로 인한 실패인지 판단.
     * 비로그인 상태에서는 백엔드가 401 을 던지지만, axios interceptor 가 자동 refresh 를 시도하다가
     * refresh 도 실패해서 400 (refresh 토큰 없음) 으로 변환돼서 올라온다. 둘 다 게스트 발급으로 회복 시도.
     */
    const isUnauthenticated = (error: unknown) => {
      if (!isAxiosError(error)) return false;
      const status = error.response?.status;
      return status === 401 || status === 400;
    };

    const run = async () => {
      try {
        const newTournamentId = await postFromPlayLink(sourceTournamentId);
        await goToTournament(newTournamentId);
      } catch (error) {
        if (isUnauthenticated(error)) {
          try {
            await postGuestLogin();
            const newTournamentId = await postFromPlayLink(sourceTournamentId);
            await goToTournament(newTournamentId);
            return;
          } catch {
            setState('expired');
            return;
          }
        }
        // 404 (없음) / 409 (만료) — 만료 안내로 통합.
        // 같은 사용자의 재진입은 백엔드가 idempotent 로 처리해 200 + 기존 CLONE id 반환한다.
        setState('expired');
      }
    };

    void run();
  }, [router, sourceTournamentId]);

  if (state === 'loading') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg-layer-basement pt-padding-top">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={32} />
          <p className="body-1-medium text-text-neutral-tertiary">토너먼트를 준비하고 있어요...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg-layer-basement px-5 pt-padding-top">
      <div className="flex flex-col items-center gap-2">
        <p className="heading-1-bold text-text-neutral-primary">플레이 링크가 유효하지 않아요</p>
        <p className="text-center body-1-medium text-text-neutral-tertiary">
          만료됐거나 이미 진행한 토너먼트일 수 있어요.
          <br />
          공유한 친구에게 새 링크를 요청해주세요.
        </p>
      </div>

      <Link href={ROUTES.HOME} className="w-full max-w-80">
        <Button size="lg" variant="primary" className="w-full">
          홈으로 가기
        </Button>
      </Link>
    </main>
  );
}

export default PlayClient;
