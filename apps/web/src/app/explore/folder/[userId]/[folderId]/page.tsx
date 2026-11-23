import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { parseIdParam } from '@/utils/parseIdParam';

import ExploreFolderContent from './_components/ExploreFolderContent';

type ExploreFolderPageProps = {
  params: Promise<{ userId: string; folderId: string }>;
};

async function ExploreFolderPage({ params }: ExploreFolderPageProps) {
  const { userId, folderId: folderIdParam } = await params;
  const folderId = parseIdParam(folderIdParam);
  if (!folderId) notFound();

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-32">
      <Suspense>
        <ExploreFolderContent userId={userId} folderId={folderId} />
      </Suspense>
    </main>
  );
}

export default ExploreFolderPage;
