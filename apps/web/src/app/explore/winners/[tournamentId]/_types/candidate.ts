import type { ExploreItemT } from '../../../_common/_types/explore';

/** 토너먼트 후보 위시 */
export type CandidateWishT = {
  wishId: number;
  item: ExploreItemT;
  /** 토너먼트 1위 여부 */
  isWinner: boolean;
};

export type GetTournamentCandidatesResponseT = {
  tournament: {
    id: number;
    title: string;
  };
  candidates: CandidateWishT[];
};
