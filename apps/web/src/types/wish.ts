import type { PresignedImageRequestT, PresignedImageResponseT } from './image';
import type { ItemT } from './item';

export type WishT = {
  id: number;
  createdAt: string;
  folderIds?: number[];
};

export type GetWishesRequestT = {
  folderId?: number;
  excludeFolderId?: number;
  q?: string;
};

export type GetWishlistResponseT = {
  wish: WishT;
  item: ItemT;
  /**
   * 내가 플레이한 토너먼트 중 이 위시가 우승한 토너먼트 id 목록
   */
  winnerTournamentIds: number[];
};

export type PostWishLinkResponseT = {
  wish: WishT;
  item: ItemT;
};

export type PostWishPresignedUrlRequestT = {
  images: PresignedImageRequestT[];
};

export type PostWishPresignedUrlResponseT = {
  uploads: PresignedImageResponseT[];
};

export type PostWishImagesRequestT = {
  imageKeys: string[];
  folderId?: number;
};

export type PostWishImagesResponseT = {
  wish: WishT;
  item: ItemT;
}[];
