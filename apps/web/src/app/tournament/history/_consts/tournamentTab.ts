import { TOURNAMENT_STATUS } from '@/consts/tournament';
import type { TournamentStatusT } from '@/types/tournament';

export type TournamentStatusTabT = 'ongoing' | 'completed';

/**
 * 탭 → 조회할 토너먼트 상태 매핑
 * - 진행 중(ongoing) 탭: 미완료(담는 중 + 플레이 중) 토너먼트
 * - 완료(completed) 탭: 완료된 토너먼트
 */
export const STATUS_BY_TAB: Record<TournamentStatusTabT, TournamentStatusT[]> = {
  ongoing: [TOURNAMENT_STATUS.PENDING, TOURNAMENT_STATUS.IN_PROGRESS],
  completed: [TOURNAMENT_STATUS.COMPLETED],
};
