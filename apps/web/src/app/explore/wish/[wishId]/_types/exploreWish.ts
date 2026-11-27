import type { ItemT } from '@/types/item';

export type GetExploreWishResponseT = {
  wishId: number;
  addedAt: string;
  saved: boolean;
  savedWishId: number | null;
  savedUserCount: number;
  item: ItemT;
  /** 프로필 비공개·차단 관계면 null */
  owner: {
    userId: string;
    nickname: string;
    profileImage: string;
    relation: 'SELF' | 'FRIEND' | 'NOT_FRIEND';
    /** 위시가 든 공개 폴더 중 가장 최근 것. 공개 폴더에 없으면 null */
    folder: { folderId: number; name: string } | null;
  } | null;
};
