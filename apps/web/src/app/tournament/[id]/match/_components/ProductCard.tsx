import BaseImage from '@/components/base-image';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import { PRODUCT_CARD_IMAGE_SIZES } from '../../_common/_consts/image';
import type { ProductT } from '../../_common/_types/tournament';

type ProductCardProps = ProductT & {
  onClick?: () => void;
};

function ProductCard({ imageUrl, name, price, onClick }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[148px] cursor-pointer flex-col overflow-hidden rounded-[20px] text-left"
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
      <div className="flex h-[102px] w-full flex-col items-center justify-between gap-1 border-t border-gray-50 bg-white p-4 text-center">
        <p className="line-clamp-2 body-2-medium text-gray-700">{name}</p>
        <p className="flex items-center justify-center gap-1 body-1-semibold text-text-neutral-primary">
          {/** TODO: 서버가 discountRate 내려주면 TournamentItemT 에 필드 추가 후 주석 해제 */}
          {/* {discountRate != null && <span className="text-sky-blue-400">{discountRate}%</span>} */}
          <span>{formatPrice(String(price))}</span>
        </p>
      </div>
    </button>
  );
}

export default ProductCard;
