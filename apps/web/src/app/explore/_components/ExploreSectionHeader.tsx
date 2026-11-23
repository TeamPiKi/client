import Link from 'next/link';

import { ChevronForwardIconFill } from '@/assets/icons';

type ExploreSectionHeaderProps = {
  title: string;
  description: string;
  /** 전체보기 이동 경로 — 없으면 전체보기를 숨김 */
  moreHref?: string;
};

function ExploreSectionHeader({ title, description, moreHref }: ExploreSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-0.5 px-5">
      <div className="flex items-center justify-between">
        <h2 className="heading-2-semibold text-text-neutral-primary">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="flex cursor-pointer items-center caption-1-regular text-text-neutral-secondary"
          >
            전체보기
            <ChevronForwardIconFill className="size-4" aria-hidden />
          </Link>
        )}
      </div>
      <p className="body-2-medium text-text-neutral-secondary">{description}</p>
    </div>
  );
}

export default ExploreSectionHeader;
