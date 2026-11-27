import Basket from '@/components/common/basket';

type FriendEmptyStateProps = {
  title: string;
  description: string;
};

function FriendEmptyState({ title, description }: FriendEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-[25px] px-5 py-30" role="status">
      <Basket type="panic" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="heading-1-semibold text-text-neutral-primary">{title}</p>
        <p className="body-1-medium text-text-neutral-tertiary">{description}</p>
      </div>
    </div>
  );
}

export default FriendEmptyState;
