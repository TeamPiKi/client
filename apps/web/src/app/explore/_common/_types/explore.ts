/** 탐색에 노출되는 상품 정보 */
export type ExploreItemT = {
  name: string;
  price: number | null;
  discountRate: number | null;
  imageUrl: string | null;
  /** 구매처 이름 */
  sourcePlatform?: string | null;
};

/** 토너먼트에서 1위를 차지한 상품 */
export type WinnerWishT = {
  /** 1위 기록 id — 위시 id 가 아님 */
  pickId: number;
  /** 1위 후보 id — 하트로 담을 때 사용 */
  candidateId: number;
  item: ExploreItemT;
  tournament: {
    id: number;
    title: string;
  };
  /** 이미 내 위시에 있는 상품인지 */
  isInMyWish: boolean;
  savedWishId: number | null;
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
  savedWishId: number | null;
};

export type RecentWishesT = {
  /** 서버가 목록을 마지막으로 다시 만든 시각 — 만든 적 없으면 null */
  updatedAt: string | null;
  wishes: RecentWishT[];
};

export type ExploreItemResponseT = {
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
  savedWishId: number | null;
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

export type ExploreTournamentResponseT = {
  tournamentId: number;
  name: string;
};

export type GetExplorePicksResponseT = {
  updatedAt: string | null;
  picks: {
    pickId: number;
    candidateId: number;
    pickedAt: string;
    saved: boolean;
    savedWishId: number | null;
    tournament: ExploreTournamentResponseT;
    item: ExploreItemResponseT;
  }[];
};

export type PostExploreWishResponseT = {
  /** 내 위시 id — 이미 가진 상품이면 원래 위시 id */
  wishId: number;
  /** true 면 새로 만들지 않음 */
  alreadySaved: boolean;
};

/** 탐색 위시 상세·1위 상세가 함께 쓰는 화면 값 */
export type ExploreDetailViewT = {
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
  savedWishId: number | null;
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
  /** 1위를 차지한 토너먼트 — 1위 상세가 아니면 null */
  winnerTournament: {
    pickId: number;
    title: string;
    candidateCount: number;
    candidateImageUrls: string[];
  } | null;
};

/** 탐색 위시 상세 */
export type ExploreWishDetailT = ExploreDetailViewT & {
  wishId: number;
};

/** 토너먼트 1위 상세 */
export type ExplorePickDetailT = ExploreDetailViewT & {
  pickId: number;
  candidateId: number;
};

/** 1위가 나온 토너먼트의 후보 목록 */
export type ExplorePickCandidatesT = {
  pickId: number;
  tournament: {
    id: number;
    title: string;
  };
  /** 1위가 맨 앞 */
  candidates: {
    candidateId: number;
    item: ExploreItemT;
    isWinner: boolean;
    isInMyWish: boolean;
    savedWishId: number | null;
  }[];
};

/** 다른 사람 공개 폴더 상세 */
export type ExploreFolderT = {
  folderId: number;
  name: string;
  wishes: {
    wishId: number;
    item: ExploreItemT;
    isInMyWish: boolean;
    savedWishId: number | null;
  }[];
};
