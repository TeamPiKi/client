import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { foldersQueryOptions } from '@/apis/getFolders';
import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import FolderWishSelectContent from './_components/FolderWishSelectContent';

type FolderWishAddPageProps = {
  params: Promise<{ folderId: string }>;
};

async function FolderWishAddPage({ params }: FolderWishAddPageProps) {
  const folderId = parseIdParam((await params).folderId);
  const queryClient = getQueryClient();

  await Promise.all([
    serverPrefetch(() => queryClient.fetchQuery(foldersQueryOptions)),
    folderId !== null &&
      serverPrefetch(() =>
        queryClient.fetchInfiniteQuery(wishesInfiniteQueryOptions({ excludeFolderId: folderId }))
      ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-bottom-cta">
        <FolderWishSelectContent folderId={folderId} />
      </main>
    </HydrationBoundary>
  );
}

export default FolderWishAddPage;
