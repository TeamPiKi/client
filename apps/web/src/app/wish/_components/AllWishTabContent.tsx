import type { ComponentProps } from 'react';

import WishGrid from '../_common/_components/WishGrid';

export type AllWishTabContentProps = ComponentProps<typeof WishGrid>;

function AllWishTabContent(props: AllWishTabContentProps) {
  /** TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: all) 추가 */
  return <WishGrid {...props} />;
}

export default AllWishTabContent;
