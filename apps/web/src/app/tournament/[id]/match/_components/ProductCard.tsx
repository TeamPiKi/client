import BaseImage from '@/components/base-image';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import formatPrice from '@/utils/formatPrice';

import { PRODUCT_CARD_IMAGE_SIZES } from '../../_common/_consts/image';
import type { ProductT } from '../../_common/_types/tournament';
import { carmenSans } from '../_consts/font';

type ProductCardProps = ProductT & {
  isPicked?: boolean;
  onClick?: () => void;
};

function ProductCard({ imageUrl, name, price, isPicked = false, onClick }: ProductCardProps) {
  return (
    <button type="button" onClick={onClick} className="relative w-[148px] cursor-pointer text-left">
      {isPicked && (
        <div
          className={cn(
            carmenSans.className,
            'absolute -top-4 -left-3.5 flex size-15 -rotate-15 items-center justify-center rounded-full bg-sky-blue-400 text-[22px] leading-6 font-bold tracking-[-0.6px] text-white shadow-[1px_3px_4px_0_rgba(0,0,0,0.15)]'
          )}
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 10 }}
        >
          Pick!
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_8.1px_0_#A2DEFF]"
          />
        </div>
      )}
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-[20px] transition-shadow duration-450',
          isPicked && 'shadow-[0_6px_18px_0_rgba(118,206,253,0.35)]'
        )}
      >
        <div className="relative h-[123px] w-full shrink-0 bg-gray-50">
          {imageUrl && (
            <BaseImage
              src={imageUrl}
              alt={name}
              sizes={PRODUCT_CARD_IMAGE_SIZES}
              preload
              className="object-cover"
            />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/5"
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          />
        </div>
        <div className="flex h-[102px] flex-col items-center justify-between gap-1 border-t border-gray-50 bg-white p-4 text-center">
          <p className="line-clamp-2 body-2-medium text-gray-700">{name}</p>
          <p className="flex items-center justify-center gap-1 body-1-semibold text-text-neutral-primary">
            {/** TODO: 서버가 discountRate 내려주면 TournamentItemT 에 필드 추가 후 주석 해제 */}
            {/* {discountRate != null && <span className="text-sky-blue-400">{discountRate}%</span>} */}
            <span>{formatPrice(String(price))}</span>
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[20px] border-2 border-sky-blue-300 transition-opacity duration-450',
          isPicked ? 'opacity-100' : 'opacity-0'
        )}
        style={{ zIndex: Z_INDEX.BASE_IMAGE + 2 }}
      />
    </button>
  );
}

export default ProductCard;
