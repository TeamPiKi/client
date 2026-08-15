import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import WishCard from '@/components/common/wish-card';

type WishSelectCardProps = {
  name: string | null;
  price: number | null;
  imageUrl: string | null;
  sourcePlatform?: string | null;
  isSelected: boolean;
  onSelect: () => void;
};

function WishSelectCard({ name, price, imageUrl, sourcePlatform, isSelected, onSelect }: WishSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className="relative h-full w-full cursor-pointer text-left"
    >
      <WishCard name={name} price={price} imageUrl={imageUrl} sourcePlatform={sourcePlatform} />
      <span className="pointer-events-none absolute top-3 left-3 z-10 block size-5">
        {isSelected ? (
          <CheckboxSelectedIconFill className="size-5 text-bg-accent" />
        ) : (
          <CheckboxEmptyIconFill className="size-5 text-black/8" />
        )}
      </span>
    </button>
  );
}

export default WishSelectCard;
