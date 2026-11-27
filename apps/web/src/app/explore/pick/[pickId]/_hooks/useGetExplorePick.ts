import { useSuspenseQuery } from '@tanstack/react-query';

import { explorePickQueryOptions } from '../_apis/getExplorePick';

export const useGetExplorePick = (pickId: number) => {
  const { data: explorePickData } = useSuspenseQuery(explorePickQueryOptions(pickId));

  return { explorePickData };
};
