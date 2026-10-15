import Link from 'next/link';

import { SearchIconOutline } from '@/assets/icons';
import { ROUTES } from '@/consts/route';

function WishSearchLink() {
  return (
    // TODO: 경로 변경 필요
    <Link href={ROUTES.HOME} aria-label="위시 검색">
      <SearchIconOutline className="size-6 text-text-neutral-primary" />
    </Link>
  );
}

export default WishSearchLink;
