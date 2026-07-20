import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';

type WishCardProps = {
  name: string;
  price: number;
  imageUrl: string | null;
  preload?: boolean;
};

function WishCard({ name, price, imageUrl, preload = false }: WishCardProps) {
  return (
    <div className="flex flex-col overflow-hidden bg-bg-layer-basement">
      {/* 이미지 */}
      <div className="relative aspect-[201/166] w-full bg-bg-layer-basement">
        {imageUrl ? (
          <BaseImage
            src={imageUrl}
            alt={name}
            sizes="(max-width: 480px) calc(100vw - 40px - 8px), 216px"
            preload={preload}
            loadingFallback={<Skeleton className="absolute inset-0 rounded-t-2xl rounded-b-none" />}
            errorFallback={
              <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                <ImageIconOutline width={40} height={40} />
              </div>
            }
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-200">
            <ImageIconOutline width={40} height={40} />
          </div>
        )}
      </div>

      {/* 상품명 + 가격 + 커머스칩 */}
      <div className="flex h-[124px] flex-col items-start gap-2.5 self-stretch p-4">
        <div className="flex flex-col gap-1 self-stretch">
          <p className="line-clamp-2 self-stretch body-2-medium text-text-neutral-primary">{name}</p>
          <p className="body-2-semibold text-text-neutral-primary">{price.toLocaleString()}원</p>
        </div>
        {/* TODO: 커머스칩 — 백엔드에 sourceName 필드 추가 후 구현 (WishItemT.sourceName) */}
      </div>
    </div>
  );
}

export default WishCard;
