import type { FOLDER_RESULT } from '@/consts/folder';

export type FolderT = {
  id: number;
  name: string;
  wishCount: number;
  /** 최근 넣은 위시 최대 3개 순서. 이미지 없는 위시 칸은 null */
  coverImageUrls: (string | null)[];
  createdAt: string;
};

export type GetFoldersResponseT = FolderT[];

export type PostFolderRequestT = {
  name: string;
};

export type PostFolderResponseT = FolderT;

export type PatchFolderRequestT = {
  name: string;
};

export type PatchFolderResponseT = FolderT;

export type PostFolderWishesRequestT = {
  wishIds: number[];
};

export type PostFolderWishesResponseT = {
  folderId: number;
  wishCount: number;
};

export type FolderWishSelectionT = { wishIds: number[] } | { all: true };

export type DeleteFolderWishesRequestT = FolderWishSelectionT;

export type DeleteFolderWishesResponseT = PostFolderWishesResponseT;

export type PostFolderWishesMoveRequestT = FolderWishSelectionT & {
  targetFolderId: number;
};

export type PostFolderWishesMoveResponseT = {
  folderId: number;
  wishCount: number;
  targetFolderId: number;
  targetWishCount: number;
};

export type FolderResultT = (typeof FOLDER_RESULT)[keyof typeof FOLDER_RESULT];
