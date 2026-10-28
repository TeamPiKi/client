import { parseIdParam } from '@/utils/parseIdParam';

import FolderWishSelectContent from './_components/FolderWishSelectContent';

type FolderWishAddPageProps = {
  params: Promise<{ folderId: string }>;
};

async function FolderWishAddPage({ params }: FolderWishAddPageProps) {
  const { folderId } = await params;

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-bottom-cta">
      <FolderWishSelectContent folderId={parseIdParam(folderId)} />
    </main>
  );
}

export default FolderWishAddPage;
