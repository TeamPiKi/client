/** 탐색에 노출되는 상품 정보 */
export type ExploreItemT = {
  name: string;
  price: number | null;
  discountRate: number | null;
  imageUrl: string | null;
  /** 구매처 이름 */
  sourcePlatform?: string | null;
};

/** 토너먼트에서 1위를 차지한 위시 */
export type WinnerWishT = {
  wishId: number;
  item: ExploreItemT;
  tournament: {
    id: number;
    title: string;
  };
};

/** 위시를 담은 친구 */
export type ExploreFriendT = {
  userId: string;
  nickname: string;
  profileImage: string;
};

/** 친구가 담은 위시 */
export type FriendWishT = {
  wishId: number;
  item: ExploreItemT;
  friend: ExploreFriendT;
};

/** 탐색 위시 상세 */
export type ExploreWishDetailT = {
  wishId: number;
  item: {
    name: string;
    price: number;
    discountRate: number | null;
    imageUrl: string;
    /** 링크로 담은 경우에만 존재 */
    sourceUrl: string | null;
  };
  /** 이미 내 위시에 있는 상품인지 */
  isInMyWish: boolean;
  /** 이 상품을 담은 사람 수 */
  savedCount: number;
  /** 위시를 담은 사람 */
  owner: {
    userId: string;
    nickname: string;
    profileImage: string;
    isFriend: boolean;
  };
  /** 위시가 담긴 공개 폴더 — 폴더 없는 위시면 null */
  folder: {
    id: number;
    name: string;
  } | null;
  /** 1위를 차지한 토너먼트 — 1위 위시가 아니면 null */
  winnerTournament: {
    id: number;
    title: string;
    candidateCount: number;
    candidateImageUrls: string[];
  } | null;
};
