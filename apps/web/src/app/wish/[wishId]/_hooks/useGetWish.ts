import { useSuspenseQuery } from '@tanstack/react-query';

import { getWish } from '../_apis/getWish';

export const useGetWish = (wishId: number) => {
  const { data: wishData } = useSuspenseQuery({
    queryKey: ['wish', wishId],
    queryFn: () => getWish(wishId),
  });

  return { wishData };
};
