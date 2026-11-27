import type {
  ExploreItemResponseT,
  ExploreTournamentResponseT,
} from '../../../_common/_types/explore';

export type GetTournamentCandidatesResponseT = {
  pickId: number;
  tournament: ExploreTournamentResponseT;
  /** 1위가 맨 앞이고 나머지는 토너먼트에 올라간 순 */
  candidates: {
    candidateId: number;
    isPick: boolean;
    saved: boolean;
    item: ExploreItemResponseT;
  }[];
};
