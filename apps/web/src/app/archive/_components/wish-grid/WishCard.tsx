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
    <div className="flex aspect-[0.765] flex-col overflow-hidden rounded-2xl bg-white">
      {/* 이미지 */}
      <div className="relative flex flex-1 items-center justify-center self-stretch bg-white">
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

      {/* 상품명 + 가격 */}
      <div className="flex flex-col items-center justify-center gap-2 self-stretch px-3 py-3">
        <p className="line-clamp-1 self-stretch text-center body-1-medium text-gray-600">{name}</p>
        <p className="heading-2 text-gray-950">{price.toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default WishCard;
