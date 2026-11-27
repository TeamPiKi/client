import type { ExploreItemResponseT } from '../../../_common/_types/explore';

export type GetExplorePickResponseT = {
  pickId: number;
  candidateId: number;
  pickedAt: string;
  saved: boolean;
  savedWishId: number | null;
  savedUserCount: number;
  item: ExploreItemResponseT;
  /** 1위를 고른 사람. 가려지면 1위 전체가 404 */
  picker: {
    userId: string;
    nickname: string;
    profileImage: string;
    relation: 'SELF' | 'FRIEND' | 'NOT_FRIEND';
    /** 고른 사람이 이 상품을 위시로 담아 공개 폴더에 넣었을 때만 존재 */
    folder: { folderId: number; name: string } | null;
  };
  tournament: {
    tournamentId: number;
    name: string;
    /** 1위 포함 */
    candidateCount: number;
    /** 후보 목록과 같은 순서. 1위가 맨 앞 */
    candidateImageUrls: string[];
  };
};
