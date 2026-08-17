'use client';

import { SERVER_ERROR_MESSAGE } from '@piki/core';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { postGuestLogin } from '@/app/login/_apis/postGuestLogin';
import { getTournament } from '@/app/tournament/[id]/_common/_apis/getTournament';
import Button from '@/components/button';
import ButtonLink from '@/components/button/ButtonLink';
import Spinner from '@/components/spinner';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { TOURNAMENT_STATUS } from '@/consts/tournament';
import { logAnalyticsEvent } from '@/utils/analytics';
import { isServerOrNetworkError } from '@/utils/apiError';

import { postFromPlayLink } from '../_apis/postFromPlayLink';

type PlayClientProps = {
  sourceTournamentId: number;
};

type PlayStateT = 'loading' | 'expired' | 'error';

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
      if (data.status === TOURNAMENT_STATUS.COMPLETED) {
        router.replace(ROUTES.TOURNAMENT_RESULT(id));
        return;
      }
      if (data.status === TOURNAMENT_STATUS.IN_PROGRESS && !data.pending) {
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
          } catch (retryError) {
            // 5xx·네트워크는 링크 문제가 아니므로 만료 안내와 구분한다
            setState(isServerOrNetworkError(retryError) ? 'error' : 'expired');
            return;
          }
        }
        if (isServerOrNetworkError(error)) {
          setState('error');
          return;
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

  if (state === 'error') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg-layer-basement px-5 pt-padding-top">
        <div className="flex flex-col items-center gap-2">
          <h1 className="heading-1-bold text-text-neutral-primary">오류가 발생했어요</h1>
          <p className="text-center body-1-medium text-text-neutral-tertiary">
            {SERVER_ERROR_MESSAGE}
          </p>
        </div>

        <div className="flex w-full max-w-80 flex-col gap-3">
          <Button
            size="lg"
            variant="primary"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
          <ButtonLink href={ROUTES.HOME} size="lg" variant="secondary" className="w-full">
            홈으로 가기
          </ButtonLink>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg-layer-basement px-5 pt-padding-top">
      <div className="flex flex-col items-center gap-2">
        <h1 className="heading-1-bold text-text-neutral-primary">플레이 링크가 유효하지 않아요</h1>
        <p className="text-center body-1-medium text-text-neutral-tertiary">
          만료됐거나 이미 진행한 토너먼트일 수 있어요.
          <br />
          공유한 친구에게 새 링크를 요청해주세요.
        </p>
      </div>

      <ButtonLink href={ROUTES.HOME} size="lg" variant="primary" className="w-full max-w-80">
        홈으로 가기
      </ButtonLink>
    </main>
  );
}

export default PlayClient;
