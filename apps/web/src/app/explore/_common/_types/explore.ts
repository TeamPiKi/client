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

export type ExploreFriendT = {
  userId: string;
  nickname: string;
  profileImage: string;
};

export type FriendWishT = {
  wishId: number;
  item: ExploreItemT;
  friend: ExploreFriendT;
};

/** 방금 담긴 위시 */
export type RecentWishT = {
  wishId: number;
  item: ExploreItemT;
  /** 담긴 시각 (ISO 8601) */
  savedAt: string;
  /** 이미 내 위시에 있는 상품인지 */
  isInMyWish: boolean;
};

export type RecentWishesT = {
  /** 서버가 목록을 마지막으로 다시 만든 시각 — 만든 적 없으면 null */
  updatedAt: string | null;
  wishes: RecentWishT[];
};

type ExploreItemResponseT = {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discountRate: number | null;
  currency: string | null;
  imageUrl: string;
  sourceUrl: string | null;
  sourcePlatform: string | null;
};

type ExploreWishResponseT = {
  wishId: number;
  addedAt: string;
  saved: boolean;
  item: ExploreItemResponseT;
};

export type GetRecentWishesResponseT = {
  updatedAt: string | null;
  wishes: ExploreWishResponseT[];
};

export type GetFriendWishesResponseT = {
  friends: ExploreFriendT[];
  wishes: (ExploreWishResponseT & { friend: ExploreFriendT })[];
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
  /** 위시를 담은 사람 — 프로필을 비공개한 유저면 null */
  owner: {
    userId: string;
    nickname: string;
    profileImage: string;
    isFriend: boolean;
  } | null;
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

/** 다른 사람 공개 폴더 상세 */
export type ExploreFolderT = {
  folderId: number;
  name: string;
  wishes: {
    wishId: number;
    item: ExploreItemT;
    /** TODO: 서버 공개 폴더 응답에 없는 값이라 API 연동 시 협의 필요 */
    isInMyWish: boolean;
  }[];
};
