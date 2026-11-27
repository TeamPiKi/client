import { useSuspenseQuery } from '@tanstack/react-query';

import { exploreWishQueryOptions } from '../_apis/getExploreWish';

export const useGetExploreWish = (wishId: number) => {
  const { data: exploreWishData } = useSuspenseQuery(exploreWishQueryOptions(wishId));

  return { exploreWishData };
};
