import { LockIconFill, PersonIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

type ProfileSummaryProps = {
  nickname: string;
  profileImage: string;
  isFriend: boolean;
  isPrivate: boolean;
  isBlocked: boolean;
};

function ProfileSummary({
  nickname,
  profileImage,
  isFriend,
  isPrivate,
  isBlocked,
}: ProfileSummaryProps) {
  return (
    <div className="flex flex-col items-center gap-4.5 px-5">
      <div className="relative size-20">
        <div
          className={cn(
            'relative size-full overflow-hidden rounded-full',
            isFriend && 'ring-5 ring-sky-blue-300'
          )}
        >
          <BaseImage
            src={profileImage}
            alt={`${nickname} 프로필 이미지`}
            sizes="80px"
            className="object-cover"
            loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
          />
          {isPrivate && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30"
              style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
            >
              <LockIconFill aria-hidden className="size-6.5 text-icon-neutral-inverse" />
              <span className="sr-only">비공개 프로필</span>
            </div>
          )}
        </div>
        {isFriend && (
          <span
            className="absolute top-14 left-15 flex size-7 items-center justify-center rounded-full bg-sky-blue-300"
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          >
            <PersonIconFill aria-hidden className="size-4 text-icon-neutral-inverse" />
            <span className="sr-only">친구</span>
          </span>
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-0.5 text-center">
        <h1 className="w-full truncate heading-1-bold text-text-neutral-primary">{nickname}</h1>
        {isBlocked && (
          <p className="body-2-regular text-text-neutral-tertiary">차단한 사용자입니다</p>
        )}
      </div>
    </div>
  );
}

export default ProfileSummary;
