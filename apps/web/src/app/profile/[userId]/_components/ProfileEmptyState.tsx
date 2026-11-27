import Basket from '@/components/common/basket';
import type { BasketTypeT } from '@/components/common/basket/basket.types';

type ProfileEmptyStateProps = {
  basketType: BasketTypeT;
  message: string;
};

function ProfileEmptyState({ basketType, message }: ProfileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6.25 pt-25" role="status">
      <Basket type={basketType} />
      <p className="text-center body-1-semibold text-text-neutral-primary">{message}</p>
    </div>
  );
}

export default ProfileEmptyState;
