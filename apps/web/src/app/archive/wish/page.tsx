import WishlistLayout from '../_components/WishlistLayout';
import WishContent from '../_components/wish-content';

async function ArchiveWishPage() {
  return (
    <WishlistLayout title="위시리스트">
      <WishContent />
    </WishlistLayout>
  );
}

export default ArchiveWishPage;
