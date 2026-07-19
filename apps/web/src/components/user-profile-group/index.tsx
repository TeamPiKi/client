import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { cn } from '@/utils/cn';

/** DS 0719 — 토너먼트 카드에서는 20px(sm) 프로필 사용 */
const SIZE_STYLES = {
  sm: {
    profile: 'size-5 border-[1.2px]',
    overlap: '-mr-[3px]',
    badge: 'size-5 border-[1.2px] caption-1-semibold',
    sizes: '20px',
  },
  md: {
    profile: 'size-6.75 border-[1.6px]',
    overlap: '-mr-2',
    badge: 'size-[27px] border-[1.6px] body-2-semibold',
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
            'relative block shrink-0 overflow-hidden rounded-full border-white',
            styles.profile,
            index === visibleProfileImageUrls.length - 1 && overflowCount <= 0 ? '' : styles.overlap
          )}
        >
          <BaseImage
            src={url}
            alt="참여자 프로필"
            sizes={styles.sizes}
            className="object-cover"
            loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
          />
        </span>
      ))}
      {overflowCount > 0 && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full border-white bg-gray-50 text-text-neutral-tertiary',
            styles.badge
          )}
          aria-label={`외 ${overflowCount}명`}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}

export default UserProfileGroup;
