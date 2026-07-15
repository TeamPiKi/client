import ArchivePageLayout from '../_common/_components/ArchivePageLayout';
import WishContent from './_components/WishContent';

async function ArchiveWishPage() {
  return (
    <ArchivePageLayout title="위시리스트">
      <WishContent />
    </ArchivePageLayout>
  );
}

export default ArchiveWishPage;
