import WishGrid from '../_common/_components/WishGrid';
import { MOCK_WISHES } from '../_common/_consts/wishMock';

function AllWishTabContent() {
  /** TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: all) 추가 */
  return <WishGrid wishes={MOCK_WISHES} />;
}

export default AllWishTabContent;
