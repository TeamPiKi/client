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
      <span className="pointer-events-none absolute top-3 left-3 z-10 block size-5 overflow-hidden">
        {isSelected ? (
          <>
            <span className="absolute inset-0.5 bg-white" />
            <CheckboxSelectedIconFill className="absolute inset-0 size-5 origin-center scale-[1.334] text-uac-light" />
          </>
        ) : (
          <span className="absolute inset-0 rounded border-[1.4px] border-white bg-black/[0.08]" />
        )}
      </span>
    </button>
  );
}

export default WishSelectCard;
