import Link from 'next/link';

import { ChevronForwardIconFill, PersonIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import type { ExploreDetailViewT } from '../_types/explore';

type WishOwnerCardProps = {
  owner: NonNullable<ExploreDetailViewT['owner']>;
  folder: ExploreDetailViewT['folder'];
};

function WishOwnerCard({ owner, folder }: WishOwnerCardProps) {
  const profileHref = ROUTES.PROFILE(owner.userId);

  return (
    <div className="relative flex items-center gap-5 rounded-2xl bg-bg-layer-default p-4">
      {/* 카드 빈 곳 탭 — 폴더가 있으면 폴더 상세, 없으면 프로필. 프로필 링크는 사진·닉네임과 겹쳐 스크린리더에서 숨김 */}
      {folder ? (
        <Link
          href={ROUTES.EXPLORE_FOLDER(owner.userId, folder.id)}
          aria-label={`${folder.name} 폴더보기`}
          className="absolute inset-0 cursor-pointer rounded-2xl"
        />
      ) : (
        <Link
          href={profileHref}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 cursor-pointer rounded-2xl"
        />
      )}

      <Link
        href={profileHref}
        aria-label={`${owner.nickname} 프로필`}
        className="relative size-10 shrink-0 cursor-pointer"
      >
        <span
          className={cn(
            'relative block size-full overflow-hidden rounded-full',
            owner.isFriend && 'outline-[2.4px] outline-sky-blue-300'
          )}
        >
          <BaseImage
            src={owner.profileImage}
            alt=""
            sizes="40px"
            className="object-cover"
            loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
          />
        </span>
        {owner.isFriend && (
          <span
            aria-label="친구"
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
            className="absolute top-[27px] left-7 flex size-4 items-center justify-center rounded-full bg-sky-blue-300"
          >
            <PersonIconFill className="size-[9px] text-white" aria-hidden />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={profileHref}
          className="relative max-w-full cursor-pointer self-start truncate body-1-semibold text-text-neutral-primary"
        >
          {owner.nickname}
        </Link>
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
