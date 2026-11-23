import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import { exploreFolderQueryOptions } from './_apis/getExploreFolder';
import ExploreFolderContent from './_components/ExploreFolderContent';
import ExploreFolderSkeleton from './_components/ExploreFolderSkeleton';

type ExploreFolderPageProps = {
  params: Promise<{ userId: string; folderId: string }>;
};

async function ExploreFolderPage({ params }: ExploreFolderPageProps) {
  const { userId, folderId: folderIdParam } = await params;
  const folderId = parseIdParam(folderIdParam);
  if (!folderId) notFound();

  const queryClient = getQueryClient();
  await serverPrefetch(() => queryClient.fetchQuery(exploreFolderQueryOptions(userId, folderId)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-32">
        <Suspense fallback={<ExploreFolderSkeleton />}>
          <ExploreFolderContent userId={userId} folderId={folderId} />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}

export default ExploreFolderPage;
