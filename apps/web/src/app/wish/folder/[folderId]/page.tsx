import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { foldersQueryOptions } from '@/apis/getFolders';
import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import FolderDetailContent from './_components/FolderDetailContent';

type FolderDetailPageProps = {
  params: Promise<{ folderId: string }>;
};

async function FolderDetailPage({ params }: FolderDetailPageProps) {
  const folderId = parseIdParam((await params).folderId);
  const queryClient = getQueryClient();

  await Promise.all([
    serverPrefetch(() => queryClient.fetchQuery(foldersQueryOptions)),
    folderId !== null &&
      serverPrefetch(() =>
        queryClient.fetchInfiniteQuery(wishesInfiniteQueryOptions({ folderId }))
      ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-46">
        <FolderDetailContent folderId={folderId} />
      </main>
    </HydrationBoundary>
  );
}

export default FolderDetailPage;
