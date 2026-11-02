import type { FolderT } from '@/types/folder';

import { MOCK_IMAGE_URLS } from './images';

export const MOCK_FOLDER: FolderT = {
  id: 1,
  name: '겨울 아우터',
  wishCount: 7,
  coverImageUrls: [MOCK_IMAGE_URLS.product, MOCK_IMAGE_URLS.product, MOCK_IMAGE_URLS.product],
  createdAt: '2026-10-20T13:02:11',
};

export const MOCK_FOLDERS: FolderT[] = [
  MOCK_FOLDER,
  {
    id: 2,
    name: '선물',
    wishCount: 0,
    coverImageUrls: [],
    createdAt: '2026-10-21T09:10:00',
  },
];
