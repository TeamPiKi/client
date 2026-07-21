import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

const SIZE_STYLES = {
  sm: {
    profile: 'size-5',
    border: 'border-[1.6px] -inset-[0.4px]',
    overlap: '-mr-[3.96px]',
    badge: 'size-5 caption-1-semibold',
    sizes: '20px',
  },
  md: {
    profile: 'size-6.75',
    border: 'border-[1.6px] -inset-[0.2px]',
    overlap: '-mr-2',
    badge: 'size-6.75 body-2-semibold',
    sizes: '27px',
  },
} as const;

type UserProfileGroupProps = {
  profileImageUrls: string[];
  /** 보여줄 최대 프로필 수. 초과 시 +N 뱃지로 표시 */
  max?: number;
  size?: keyof typeof SIZE_STYLES;
  className?: string;
};

function UserProfileGroup({
  profileImageUrls,
  max = 3,
  size = 'md',
  className,
}: UserProfileGroupProps) {
  const visibleProfileImageUrls = profileImageUrls.slice(0, max);
  const overflowCount = profileImageUrls.length - max;
  const styles = SIZE_STYLES[size];

  return (
    <div className={cn('flex items-center', className)}>
      {visibleProfileImageUrls.map((url, index) => (
        <span
          key={`${url}-${index}`}
          className={cn(
            'relative block shrink-0 overflow-hidden rounded-full',
            styles.profile,
            !(index === visibleProfileImageUrls.length - 1 && overflowCount <= 0) && styles.overlap
          )}
        >
          <BaseImage
            src={url}
            alt="참여자 프로필"
            sizes={styles.sizes}
            className="object-cover"
            loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
          />
          <span
            aria-hidden
            className={cn('pointer-events-none absolute rounded-full border-white', styles.border)}
            style={{ zIndex: Z_INDEX.BASE_IMAGE }}
          />
        </span>
      ))}
      {overflowCount > 0 && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-gray-50 text-text-neutral-tertiary',
            styles.badge
          )}
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
