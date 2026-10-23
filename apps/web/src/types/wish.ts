import type { PresignedImageRequestT, PresignedImageResponseT } from './image';
import type { ItemT } from './item';

export type WishT = {
  id: number;
  createdAt: string;
};

export type GetWishlistResponseT = {
  wish: WishT;
  item: ItemT;
  /**
   * 갱신 필요 여부
   * - 이미지로 등록한 경우: null
   * - 링크로 등록한 경우: boolean
   */
  refreshNeeded: boolean | null;
  /**
   * 재사용 여부
   * - 이미지로 등록한 경우: null
   * - 링크로 등록한 경우: boolean
   */
  reused: boolean | null;
  /**
   * 내가 플레이한 토너먼트 중 이 위시가 우승한 토너먼트 id 목록
   */
  winnerTournamentIds: number[];
};

export type PostWishLinkResponseT = {
  wish: WishT;
  item: ItemT;
  refreshNeeded: boolean;
  reused: boolean;
};

export type PostWishPresignedUrlRequestT = {
  images: PresignedImageRequestT[];
};

export type PostWishPresignedUrlResponseT = {
  uploads: PresignedImageResponseT[];
};

export type PostWishImagesRequestT = {
  imageKeys: string[];
};

export type PostWishImagesResponseT = {
  wish: WishT;
  item: ItemT;
  refreshNeeded: null;
  reused: null;
}[];
