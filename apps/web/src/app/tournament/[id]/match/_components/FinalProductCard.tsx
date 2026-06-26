import BaseImage from '@/components/base-image';
import { Z_INDEX } from '@/consts/zIndex';

import type { ProductT } from '../../_common/_types/tournament';

type FinalProductCardProps = ProductT & {
  isPicked?: boolean;
  onClick?: () => void;
};

function FinalProductCard({ imageUrl, name, price, isPicked, onClick }: FinalProductCardProps) {
  return (
    <button type="button" onClick={onClick} className="relative w-[148px] cursor-pointer text-left">
      {isPicked && (
        <div
          className="absolute top-0 left-1/2 flex size-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 10 }}
        >
          <span className="-rotate-12 body-1-bold text-white">Pick!</span>
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
        <div className="flex flex-col gap-2 p-4 text-center">
          <p className="body-2-medium text-text-neutral-secondary">{name}</p>
          <p className="body-1-bold text-text-neutral-primary">{price.toLocaleString()}원</p>
        </div>
      </div>
    </button>
  );
}

export default FinalProductCard;
