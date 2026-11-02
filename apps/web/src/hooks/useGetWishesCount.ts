import { useQuery } from '@tanstack/react-query';

import { wishesCountQueryOptions } from '@/apis/getWishesCount';
import type { GetWishesRequestT } from '@/types/wish';

export const useGetWishesCount = (request: GetWishesRequestT = {}, enabled = true) => {
  const { data: wishesCountData } = useQuery({ ...wishesCountQueryOptions(request), enabled });

  return { wishesCountData };
};
