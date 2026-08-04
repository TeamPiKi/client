'use client';

import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import type { TournamentItemT } from '@/types/tournament';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { getTournament } from '../../_common/_apis/getTournament';
import type {
  GetTournamentInProgressResponseT,
  TournamentMatchT,
} from '../../_common/_types/tournamentResponse';
import { type TransitionStageT, getRoundLabel, getTransitionStage } from '../_consts/rounds';
import { usePostRecordMatch } from './usePostRecordMatch';

type UseTournamentArgs = {
  tournamentId: number;
  /** 현재 미사용 — TournamentClient 호출 시그니처 유지를 위해 인자만 받는다 */
  tournamentName: string;
  inProgress: GetTournamentInProgressResponseT['inProgress'];
};

type InProgressT = NonNullable<GetTournamentInProgressResponseT['inProgress']>;

const useTournament = ({ tournamentId, inProgress }: UseTournamentArgs) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { postRecordMatchMutation, isPostRecordMatchPending } = usePostRecordMatch({
    tournamentId,
    onSuccess: data => {
      if (!data.completed) return;
      // 결승 종료 후 result 페이지가 권위 응답(hasGroupResult/playLinkExpiresAt/isRoot 등)
      // 을 받아야 하므로 클라 캐시는 비워 두고 SSR fresh data 로 채우게 한다.
      // (시드해두면 stale 한 hasGroupResult=false 가 클라에 남아 카드 노출이 늦어짐)
      queryClient.removeQueries({ queryKey: ['tournament', tournamentId] });
    },
  });

  // 서버 권위의 현재 라운드 (2, 4, 8, ...) — 라운드 종료 시 재조회로 갱신
  const [currentRound, setCurrentRound] = useState(inProgress.currentRound);
  // 서버 브래킷이 정한 현재 대결 — 기록 응답의 nextMatch 로 갱신된다
  const [currentMatch, setCurrentMatch] = useState<TournamentMatchT | undefined>(
    inProgress.currentMatch
  );
  // 라운드 내 진행한 매치 수 (라벨 표기용) — 라운드가 바뀌면 0 으로 초기화
  const [matchIndex, setMatchIndex] = useState(0);
  const [transitionStage, setTransitionStage] = useState<TransitionStageT | null>(null);
  // 카드 선택 락 해제용 — 매치가 바뀌지 않는 기록 실패에서 VsSection 을 remount 시켜
  // 재선택을 가능하게 한다 (락은 useCardSelectionAnimation 내부 상태)
  const [selectionEpoch, setSelectionEpoch] = useState(0);

  // 준결승/결승 바텀시트 표시 중 재조회 없이 적용할 다음 라운드 데이터
  const pendingNextRoundRef = useRef<InProgressT | null>(null);

  const roundLabel = getRoundLabel(currentRound, matchIndex);
  const isFinalRound = currentRound === 2;

  /**
   * 서버 권위 상태로 재동기화.
   * - 라운드 종료(nextMatch === null) 후 다음 라운드 진입
   * - 기록 실패로 클라/서버 상태가 어긋났을 때 복구
   * 라운드가 넘어간 상태면 기존 전환 UX(준결승/결승 바텀시트)를 그대로 태운다.
   */
  const syncWithServer = async () => {
    const next = await getTournament(tournamentId);
    queryClient.setQueryData(['tournament', tournamentId], next);

    if (next.status === 'COMPLETED') {
      router.replace(ROUTES.TOURNAMENT_RESULT(tournamentId));
      return;
    }
    if (next.status !== 'IN_PROGRESS' || !next.inProgress) return;

    const nextInProgress = next.inProgress;

    // 라운드 전환 — 서버의 실제 다음 라운드 수 기준으로 바텀시트 판단
    if (nextInProgress.currentRound !== currentRound) {
      const stage = getTransitionStage(nextInProgress.currentRound);

      if (stage !== 'toNext') {
        // 준결승/결승 바텀시트 — ref 에 저장하고 시트 표시
        pendingNextRoundRef.current = nextInProgress;
        setTransitionStage(stage);
        return;
      }
    }

    setCurrentRound(nextInProgress.currentRound);
    setCurrentMatch(nextInProgress.currentMatch);
    setMatchIndex(0);
  };

  const unlockSelection = () => setSelectionEpoch(prev => prev + 1);

  /**
   * 기록은 성공했고 다음 라운드 조회만 실패한 상태 — 재선택을 유도하면 같은 매치를
   * 중복 기록하게 되므로, 조회(GET)만 다시 시도하는 액션을 토스트로 제공한다.
   */
  const showSyncRetryToast = () => {
    toast.error('다음 라운드를 불러오지 못했어요.', {
      // 이 토스트가 유일한 복구 수단이라 자동으로 사라지지 않게 유지 (id 로 중복 표시 방지)
      id: 'tournament-sync-retry',
      duration: Infinity,
      action: {
        label: '다시 시도',
        onClick: () => {
          syncWithServer()
            .then(() => toast.dismiss('tournament-sync-retry'))
            .catch(showSyncRetryToast);
        },
      },
    });
  };

  const handleSelect = (winner: TournamentItemT) => {
    if (!currentMatch) return;

    const { first, second } = currentMatch;

    postRecordMatchMutation(
      {
        currentRound,
        firstTournamentItemId: first.tournamentItemId,
        secondTournamentItemId: second.tournamentItemId,
        selectedTournamentItemId: winner.tournamentItemId,
      },
      {
        onSuccess: async data => {
          // 토너먼트 종료 — 캐시 정리(훅 onSuccess)까지 끝난 뒤 결과 페이지로
          if (data.completed) {
            router.push(ROUTES.TOURNAMENT_RESULT(tournamentId));
            return;
          }

          // 같은 라운드의 다음 대결 — 서버가 준 매치로 교체
          if (data.nextMatch) {
            setCurrentMatch(data.nextMatch);
            setMatchIndex(prev => prev + 1);
            return;
          }

          // nextMatch 없음 — 라운드 종료. 재조회로 다음 라운드 진입
          try {
            await syncWithServer();
          } catch {
            // 조회 실패 — 자동 1회 재시도 후에도 실패하면 수동 재시도 토스트로 전환
            try {
              await syncWithServer();
            } catch {
              showSyncRetryToast();
            }
          }
        },
        onError: async error => {
          const status = isAxiosError<ApiErrorResponseT>(error) ? error.response?.status : null;

          // 400 TOURNAMENT-034(브래킷에 없는 조합) · 409 TOURNAMENT-035(이미 기록된 대결)
          // — 클라 상태가 서버 브래킷과 어긋난 것이라 재선택이 아니라 재동기화가 필요하다.
          if (status === 400 || status === 409) {
            toast.error(getApiErrorMessage(error));
            try {
              await syncWithServer();
            } catch {
              showSyncRetryToast();
            }
            return;
          }

          // 그 외(네트워크·5xx) — 매치는 그대로라 재선택할 수 있게 카드 락만 푼다
          toast.error('선택을 저장하지 못했어요. 다시 골라주세요.');
          unlockSelection();
        },
      }
    );
  };

  const handleTransitionComplete = () => {
    const pendingNextRound = pendingNextRoundRef.current;

    if (pendingNextRound) {
      setCurrentRound(pendingNextRound.currentRound);
      setCurrentMatch(pendingNextRound.currentMatch);
      setMatchIndex(0);
      pendingNextRoundRef.current = null;
    }

    setTransitionStage(null);
  };

  return {
    currentMatch,
    roundLabel,
    isFinalRound,
    transitionStage,
    selectionEpoch,
    /** 기록 요청 대기 중 — 다음 매치를 서버가 주므로 이 동안 스켈레톤을 노출한다 */
    isRecordingMatch: isPostRecordMatchPending,
    handleSelect,
    handleTransitionComplete,
  };
};

export default useTournament;
