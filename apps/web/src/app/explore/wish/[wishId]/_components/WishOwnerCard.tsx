import Link from 'next/link';

import { ChevronForwardIconFill, PersonIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';

import type { ExploreWishDetailT } from '../_types/exploreWish';

type WishOwnerCardProps = {
  owner: ExploreWishDetailT['owner'];
  folder: ExploreWishDetailT['folder'];
};

function WishOwnerCard({ owner, folder }: WishOwnerCardProps) {
  const profileHref = ROUTES.PROFILE(owner.userId);

  return (
    <div className="flex items-center gap-5 rounded-2xl bg-bg-layer-default p-4">
      <Link
        href={profileHref}
        aria-label={`${owner.nickname} 프로필`}
        className="relative size-10 shrink-0 cursor-pointer"
      >
        <span className="relative block size-full overflow-hidden rounded-full outline-2 outline-white">
          <BaseImage
            src={owner.profileImage}
            alt=""
            sizes="40px"
            className="object-cover"
            loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
          />
        </span>
        <span className="absolute top-[27px] left-7 flex size-4 items-center justify-center rounded-full bg-sky-blue-300">
          <PersonIconFill className="size-[9px] text-white" aria-hidden />
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={profileHref}
          className="cursor-pointer truncate body-1-semibold text-text-neutral-primary"
        >
          {owner.nickname}
        </Link>
        {/** TODO: 다른 유저 폴더 상세 라우트가 정해지면 링크로 연결 */}
        {folder && (
          <p className="truncate caption-1-regular text-text-neutral-secondary">
            {folder.name} 폴더보기
          </p>
        )}
      </div>

      <ChevronForwardIconFill
        className="size-6.5 shrink-0 text-icon-neutral-secondary"
        aria-hidden
      />
    </div>
  );
}

export default WishOwnerCard;
