export type FolderT = {
  id: number;
  name: string;
  wishCount: number;
  coverImageUrls: string[];
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

export type DeleteFolderWishesRequestT = PostFolderWishesRequestT;

export type DeleteFolderWishesResponseT = PostFolderWishesResponseT;

export type PostFolderWishesMoveRequestT = {
  wishIds: number[];
  targetFolderId: number;
};

export type PostFolderWishesMoveResponseT = {
  folderId: number;
  wishCount: number;
  targetFolderId: number;
  targetWishCount: number;
};
