import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { notFound, redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getWish } from './_apis/getWish';

type WishEditLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function WishEditLayout({ children, params }: WishEditLayoutProps) {
  const { id } = await params;
  const wishId = parseIdParam(id);
  if (!wishId) notFound();

  const queryClient = getQueryClient();

  /** 위시 접근 권한 조회 */
  try {
    const wishData = await getWish(wishId);
    queryClient.setQueryData(['wish', wishId], wishData);

    /** 아직 PROCESSING 상태인 경우에는 접근 불가 */
    if (wishData.item.status === 'PROCESSING' || wishData.item.status === 'PENDING')
      redirect(ROUTES.ARCHIVE());
  } catch (error) {
    if (!isAxiosError<ApiErrorResponseT>(error)) throw error;

    /** 위시가 존재하지 않는 경우 */
    if (error.response?.status === 404)
      redirect(ROUTES.ARCHIVE('wish'));

    throw error;
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default WishEditLayout;
