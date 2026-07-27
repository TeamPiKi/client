import BaseImage from '@/components/base-image';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import type { ProductT } from '../../_common/_types/tournament';

type ProductCardProps = ProductT & {
  isPicked?: boolean;
  isFinal?: boolean;
  onClick?: () => void;
};

function ProductCard({ imageUrl, name, price, isPicked, isFinal = false, onClick }: ProductCardProps) {
  return (
    <button type="button" onClick={onClick} className="relative w-[148px] cursor-pointer text-left">
      {isPicked && (
        <div
          className="absolute top-0 left-1/2 flex size-15 -translate-x-1/2 -translate-y-1/2 -rotate-15 items-center justify-center rounded-full bg-sky-blue-400 shadow-[1px_3px_4px_0_rgba(0,0,0,0.15)]"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 10 }}
        >
          <span className="text-[20px] leading-5.5 font-bold tracking-[-0.6px] text-white">
            Pick!
          </span>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_8.1px_0_#A2DEFF]"
          />
        </div>
      )}
      <div className="flex w-[148px] flex-col overflow-hidden rounded-2xl bg-bg-layer-default shadow-[0_1px_8px_0_rgba(0,0,0,0.10)]">
        <div className="relative h-[123px] w-[148px] shrink-0 bg-gray-50">
          {imageUrl && (
            <BaseImage
              src={imageUrl}
              alt={name}
              sizes="(max-width: 480px) 45vw, 200px"
              preload
              className="object-cover"
            />
          )}
        </div>
        <div className={`flex gap-2 p-4 text-center ${isFinal ? 'flex-col' : 'flex-1 flex-col items-center justify-center'}`}>
          <p className="body-2-medium text-text-neutral-secondary">{name}</p>
          <p className="body-1-bold text-text-neutral-primary">{formatPrice(String(price))}</p>
        </div>
      </div>
    </button>
  );
}

export default ProductCard;
