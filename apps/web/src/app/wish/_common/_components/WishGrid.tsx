import type { WishListItemT } from '../_types/wish';
import WishCard from './WishCard';

type WishGridProps = {
  wishes: WishListItemT[];
};

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 6;

/** 위시 3열 그리드 **/
function WishGrid({ wishes }: WishGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-x-[1.5px] gap-y-6">
      {wishes.map(({ wish, item }, index) => (
        <li key={wish.id}>
          <WishCard
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            sourcePlatform={item.sourcePlatform}
            discountRate={item.discountRate}
            preload={index < PRELOAD_COUNT}
          />
        </li>
      ))}
    </ul>
  );
}

export default WishGrid;
