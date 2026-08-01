import type { TOURNAMENT_STATUS } from '@/consts/tournament';
import type { ItemStatusT } from '@/types/item';

export type TournamentStatusT = (typeof TOURNAMENT_STATUS)[keyof typeof TOURNAMENT_STATUS];

export type TournamentItemT = {
  tournamentItemId: number;
  itemId?: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  status?: ItemStatusT;
};

export type TournamentMatchHistoryT = {
  currentRound: number;
  firstTournamentItemId: number;
  secondTournamentItemId: number;
  selectedTournamentItemId: number;
};

export type TournamentRankingT = TournamentItemT & {
  rank: number;
};

export type GetTournamentListResponseT = {
  tournamentId: number;
  name: string;
  status: TournamentStatusT;
  createdAt: string;
  participantProfileImages: string[];
  thumbnailUrls: string[];
}[];

export type PostTournamentOCRResponseT = {
  itemIds: number[];
};

export type PostCreateTournamentRequestT = {
  name: string;
  /** 초대 마감까지 남은 분 단위 시간 (1~1440). 미지정 시 서버 기본값 사용. */
  inviteDurationMinutes?: number;
};

export type PostCreateTournamentResponseT = {
  tournamentId: number;
};

export type TournamentErrorTypeT =
  | 'NO_WISH_EXISTS'
  | 'ALREADY_STARTED'
  | 'ALREADY_ENDED'
  | 'LINK_EXPIRED'
  | 'PARTICIPANTS_FULL'
  | 'REQUEST_FAILED';
