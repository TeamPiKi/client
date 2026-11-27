import type { ItemT } from '@/types/item';

export type GetExploreFolderResponseT = {
  folderId: number;
  name: string;
  wishes: {
    wishId: number;
    saved: boolean;
    item: ItemT;
  }[];
};
