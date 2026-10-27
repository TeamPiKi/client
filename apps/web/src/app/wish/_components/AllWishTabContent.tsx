import WishGrid from '@/components/common/wish-grid';

import type { AllWishTabContentProps } from '../_types/wishTab';
import WishAddCard from './WishAddCard';

function AllWishTabContent(props: AllWishTabContentProps) {
  const isEditMode = Boolean(props.selectedWishIds);

  /** TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: all) 추가 */
  return <WishGrid {...props} leadingItem={!isEditMode && <WishAddCard />} />;
}

export default AllWishTabContent;
