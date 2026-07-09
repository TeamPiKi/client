import type { GetTournamentPendingResponseT } from '@/app/tournament/[id]/_common/_types/tournamentResponse';
import type { TournamentT } from '@/types/tournament';

export const MOCK_TOURNAMENT_LIST: TournamentT[] = [
  {
    tournamentId: 1,
    name: 'E2E 토너먼트',
    status: 'PENDING',
    createdAt: '2026-01-01T00:00:00Z',
    /** 외부 이미지 URL 금지 — next/image 가 서버사이드에서 fetch 해 목킹이 불가능하다 */
    participantProfileImages: [],
  },
];

export const MOCK_TOURNAMENT_PENDING: GetTournamentPendingResponseT = {
  tournamentId: 1,
  name: 'E2E 토너먼트',
  isOwner: true,
  isRoot: true,
  status: 'PENDING',
  pending: {
    ownerStarted: false,
    inviteCode: 'E2ECODE',
    /** 미래 시각으로 고정해 초대 만료 카운트다운이 항상 유효하도록 */
    inviteExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    /** status 가 PENDING/PROCESSING 인 아이템을 두지 않아 SSE 폴백 폴링이 돌지 않게 함 */
    items: [],
    participants: [
      { userId: 'e2e-guest-id', nickname: '피키게스트', itemCount: 0, profileImage: '' },
    ],
  },
};
