/** 탐색에 노출되는 상품 정보 */
export type ExploreItemT = {
  name: string;
  price: number | null;
  discountRate: number | null;
  imageUrl: string | null;
};

/** 토너먼트에서 1위를 차지한 위시 */
export type WinnerWishT = {
  wishId: number;
  item: ExploreItemT;
  tournament: {
    id: number;
    title: string;
  };
};
