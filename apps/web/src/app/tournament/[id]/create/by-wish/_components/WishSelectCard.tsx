import CheckboxEmptyIconFill from '@/assets/icons/fill/checkbox-empty.svg';
import CheckboxSelectedIconFill from '@/assets/icons/fill/checkbox-selected.svg';
import WishCard from '@/components/common/wish-card';

type WishSelectCardProps = {
  name: string;
  price: number;
  imageUrl: string | null;
  isSelected: boolean;
  onSelect: () => void;
};

function WishSelectCard({ name, price, imageUrl, isSelected, onSelect }: WishSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className="relative h-full w-full cursor-pointer text-left"
    >
      <WishCard name={name} price={price} imageUrl={imageUrl} />
      <span className="pointer-events-none absolute top-3 left-3 z-10 size-6">
        {isSelected ? (
          <CheckboxSelectedIconFill className="relative size-6 text-bg-accent" />
        ) : (
          <CheckboxEmptyIconFill className="relative size-6 text-black/8" />
        )}
      </span>
    </button>
  );
}

export default WishSelectCard;
