'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { TournamentItemT } from '@/types/tournament';

import { getTournament } from '../../_common/_apis/getTournament';
import type { GetTournamentInProgressResponseT } from '../../_common/_types/tournamentResponse';
import { type TransitionStageT, getRoundLabel, getTransitionStage } from '../_consts/rounds';
import { pairByPriceAsc, shufflePairs } from '../_utils/pairItems';
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
  const { postRecordMatchMutation } = usePostRecordMatch({
    tournamentId,
    onSuccess: data => {
      if (!data) return;
      // 결승 종료 후 result 페이지가 권위 응답(hasGroupResult/playLinkExpiresAt/isRoot 등)
      // 을 받아야 하므로 클라 캐시는 비워 두고 SSR fresh data 로 채우게 한다.
      // (시드해두면 stale 한 hasGroupResult=false 가 클라에 남아 카드 노출이 늦어짐)
      queryClient.removeQueries({ queryKey: ['tournament', tournamentId] });
    },
  });

  // 서버 권위의 현재 라운드 (2, 4, 8, ...) — 라운드 종료 시 refetch로 갱신
  const [currentRound, setCurrentRound] = useState(inProgress.currentRound);
  // 현재 라운드 진행 중 남은 미대결 아이템 (매치 끝날 때마다 두 아이템씩 빠짐)
  const [remainingItems, setRemainingItems] = useState<TournamentItemT[]>(
    inProgress.remainingItems
  );
  const [transitionStage, setTransitionStage] = useState<TransitionStageT | null>(null);
  // SSR과 클라이언트 첫 렌더에서 동일한 페어 순서를 보장하기 위해, 마운트 후에만 셔플 적용
  // (Math.random 결과가 SSR/CSR 간 달라 hydration mismatch 발생)
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // 준결승/결승 바텀시트 표시 중 재조회 없이 적용할 다음 라운드 데이터
  const pendingNextRoundRef = useRef<InProgressT | null>(null);

  // 페어 생성 — SSR/첫 렌더: 가격 오름차순 그대로, 마운트 후: 셔플 적용
  const pairs = useMemo(() => {
    const sorted = pairByPriceAsc(remainingItems);
    return isMounted ? shufflePairs(sorted) : sorted;
  }, [remainingItems, isMounted]);
  const currentMatch = pairs[0];
  // 현재 라운드 전체 매치 수 = currentRound / 2
  // 진행한 매치 수 = (currentRound - remainingItems.length) / 2
  const matchIndex = (currentRound - remainingItems.length) / 2;
  const roundLabel = getRoundLabel(currentRound, matchIndex);
  const isFinalRound = currentRound === 2;
  const isLastMatchInRound = pairs.length === 1;

  /**
   * 서버 권위 상태로 재동기화.
   * - 낙관적 업데이트가 서버와 어긋났을 때 (매치 기록 실패) 롤백 용도
   * - 라운드 전환 조회 실패 시 재시도 용도
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
    // (currentRound / 2 계산은 홀수 강에서 틀릴 수 있어 서버 응답만 신뢰)
    if (nextInProgress.currentRound !== currentRound) {
      const stage = getTransitionStage(nextInProgress.currentRound);

      if (stage !== 'toNext') {
        // 준결승/결승 바텀시트 — ref에 저장하고 시트 표시
        pendingNextRoundRef.current = nextInProgress;
        setTransitionStage(stage);
        return;
      }
    }

    setCurrentRound(nextInProgress.currentRound);
    setRemainingItems(nextInProgress.remainingItems);
  };

  const handleSelect = (winner: TournamentItemT) => {
    if (!currentMatch) return;

    const [first, second] = currentMatch;

    const matchBody = {
      currentRound,
      firstTournamentItemId: first.tournamentItemId,
      secondTournamentItemId: second.tournamentItemId,
      selectedTournamentItemId: winner.tournamentItemId,
    };

    // 결승전 — onSuccess(캐시를 COMPLETED로 시드)까지 기다린 후 결과 페이지로 이동
    if (isFinalRound) {
      postRecordMatchMutation(matchBody, {
        onSuccess: () => router.push(ROUTES.TOURNAMENT_RESULT(tournamentId)),
        // 낙관적 상태 변경이 없는 경로 — 현재 매치가 그대로 남아 있어 재선택으로 복구 가능
        onError: () => toast.error('선택을 저장하지 못했어요. 다시 골라주세요.'),
      });
      return;
    }

    // 라운드 마지막 매치 — 기록 성공 후 서버 재조회로 다음 라운드 진입
    if (isLastMatchInRound) {
      postRecordMatchMutation(matchBody, {
        onSuccess: async () => {
          try {
            await syncWithServer();
          } catch {
            // 기록은 이미 성공했고 조회만 실패한 상태 — 여기서 재선택을 유도하면
            // 같은 매치를 중복 기록하게 되므로, 재조회 1회 재시도로 복구한다.
            try {
              await syncWithServer();
            } catch {
              toast.error(
                '다음 라운드를 불러오지 못했어요. 네트워크 확인 후 잠시 뒤 다시 시도해주세요.'
              );
            }
          }
        },
        onError: () => toast.error('선택을 저장하지 못했어요. 다시 골라주세요.'),
      });
      return;
    }

    // 일반 라운드 — 낙관적 진행 (기록 요청과 동시에 다음 매치로)
    postRecordMatchMutation(matchBody, {
      // 기록 실패 시 낙관적으로 제거한 페어를 복구해 클라/서버 상태 정합을 맞춘다.
      onError: async () => {
        toast.error('선택을 저장하지 못했어요. 다시 골라주세요.');
        try {
          await syncWithServer();
        } catch {
          // 재조회마저 실패 — 로컬에서 페어만 복원 (pairByPriceAsc 가 재정렬하므로 순서 무관)
          setRemainingItems(prev => {
            const existingIds = new Set(prev.map(item => item.tournamentItemId));
            const restored = [first, second].filter(
              item => !existingIds.has(item.tournamentItemId)
            );
            return [...prev, ...restored];
          });
        }
      },
    });

    // 현재 매치 페어를 remainingItems에서 제거 (서버 동작과 동일)
    setRemainingItems(prev =>
      prev.filter(
        item =>
          item.tournamentItemId !== first.tournamentItemId &&
          item.tournamentItemId !== second.tournamentItemId
      )
    );
  };

  const handleTransitionComplete = () => {
    const pendingNextRound = pendingNextRoundRef.current;

    if (pendingNextRound) {
      setCurrentRound(pendingNextRound.currentRound);
      setRemainingItems(pendingNextRound.remainingItems);
      pendingNextRoundRef.current = null;
    }

    setTransitionStage(null);
  };

  return {
    currentMatch,
    roundLabel,
    isFinalRound,
    transitionStage,
    handleSelect,
    handleTransitionComplete,
  };
};

export default useTournament;
