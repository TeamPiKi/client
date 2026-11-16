import { IS_WISH_FOLDER_ENABLED } from '@/consts/featureFlag';

import ArchiveByWishContent from './_archive/_components/ByWishContent';
import ByWishContent from './_components/ByWishContent';

type ByWishPageProps = {
  params: Promise<{ id: string }>;
};

async function ByWishPage({ params }: ByWishPageProps) {
  const { id } = await params;
  const tournamentId = Number(id);

  if (!IS_WISH_FOLDER_ENABLED) return <ArchiveByWishContent tournamentId={tournamentId} />;

  return <ByWishContent tournamentId={tournamentId} />;
}

export default ByWishPage;
