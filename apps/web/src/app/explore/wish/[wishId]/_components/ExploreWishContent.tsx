'use client';

import { notFound } from 'next/navigation';

import { ROUTES } from '@/consts/route';

import ExploreDetailView from '../../../_common/_components/ExploreDetailView';
import SaveToMyWishCta from '../../../_common/_components/SaveToMyWishCta';
import { usePostExploreWish } from '../../../_common/_hooks/usePostExploreWish';
import { useGetExploreWish } from '../_hooks/useGetExploreWish';

type ExploreWishContentProps = {
  wishId: number;
};

function ExploreWishContent({ wishId }: ExploreWishContentProps) {
  const { exploreWishData } = useGetExploreWish(wishId);
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  /** 페이지가 없는 위시를 걸러 내지만 타입상 null 이 남아 한 번 더 막음 */
  if (!exploreWishData) notFound();

  return (
    <ExploreDetailView
      detail={exploreWishData}
      cta={
        <SaveToMyWishCta
          isInMyWish={exploreWishData.isInMyWish}
          isPending={isPostExploreWishPending}
          onSave={() => postExploreWishMutation(wishId)}
          redirectPath={ROUTES.EXPLORE_WISH(wishId)}
        />
      }
    />
  );
}

export default ExploreWishContent;
