import type { GetExploreFolderResponseT } from '@/app/explore/folder/[userId]/[folderId]/_types/exploreFolder';

import { MOCK_WISHLIST_ENTRIES } from './wish';

export const MOCK_FOLDER_OWNER_ID = '00000000-0000-4000-8000-000000000002';

export const MOCK_EXPLORE_FOLDER: GetExploreFolderResponseT = {
  folderId: 7,
  name: '겨울 대비',
  wishes: MOCK_WISHLIST_ENTRIES.slice(0, 2).map(({ wish, item }) => ({ wishId: wish.id, item })),
};
