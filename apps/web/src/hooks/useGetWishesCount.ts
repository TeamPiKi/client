import { useSuspenseQuery } from '@tanstack/react-query';

import { wishesCountQueryOptions } from '@/apis/getWishesCount';
import type { GetWishesRequestT } from '@/types/wish';

export const useGetWishesCount = (request: GetWishesRequestT = {}) => {
  const { data: wishesCountData } = useSuspenseQuery(wishesCountQueryOptions(request));

  return { wishesCountData };
};
