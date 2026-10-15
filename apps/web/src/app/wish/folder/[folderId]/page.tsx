import { parseIdParam } from '@/utils/parseIdParam';

import FolderDetailContent from './_components/FolderDetailContent';

type FolderDetailPageProps = {
  params: Promise<{ folderId: string }>;
};

async function FolderDetailPage({ params }: FolderDetailPageProps) {
  const { folderId } = await params;

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-46">
      <FolderDetailContent folderId={parseIdParam(folderId)} />
    </main>
  );
}

export default FolderDetailPage;
