import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

type UserProfileGroupProps = {
  profileImageUrls: string[];
  /** 보여줄 최대 프로필 수. 초과 시 +N 뱃지로 표시 */
  max?: number;
  className?: string;
};

function UserProfileGroup({ profileImageUrls, max = 3, className }: UserProfileGroupProps) {
  const visibleProfileImageUrls = profileImageUrls.slice(0, max);
  const overflowCount = profileImageUrls.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {visibleProfileImageUrls.map((url, index) => (
        <span
          key={`${url}-${index}`}
          className={cn(
            'relative block size-[22px] shrink-0 rounded-full',
            index === visibleProfileImageUrls.length - 1 && overflowCount <= 0 ? '' : '-mr-[3.96px]'
          )}
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <BaseImage
              src={url}
              alt="참여자 프로필"
              sizes="22px"
              className="object-cover"
              loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
            />
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[0.2px] rounded-full border-[1.6px] border-white"
            style={{ zIndex: Z_INDEX.BASE_IMAGE }}
          />
        </span>
      ))}
      {overflowCount > 0 && (
        <span
          className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-gray-50 body-2-semibold text-text-neutral-tertiary"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          aria-label={`외 ${overflowCount}명`}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}

export default UserProfileGroup;
