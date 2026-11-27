'use client';

import { notFound } from 'next/navigation';

import { ROUTES } from '@/consts/route';

import ExploreDetailView from '../../../_common/_components/ExploreDetailView';
import SaveToMyWishCta from '../../../_common/_components/SaveToMyWishCta';
import { usePostExplorePickCandidate } from '../../../_common/_hooks/usePostExplorePickCandidate';
import { useGetExplorePick } from '../_hooks/useGetExplorePick';

type ExplorePickContentProps = {
  pickId: number;
};

function ExplorePickContent({ pickId }: ExplorePickContentProps) {
  const { explorePickData } = useGetExplorePick(pickId);
  const { postExplorePickCandidateMutation, isPostExplorePickCandidatePending } =
    usePostExplorePickCandidate();

  /** 페이지가 없는 1위를 걸러 내지만 타입상 null 이 남아 한 번 더 막음 */
  if (!explorePickData) notFound();

  return (
    <ExploreDetailView
      detail={explorePickData}
      cta={
        <SaveToMyWishCta
          isInMyWish={explorePickData.isInMyWish}
          isPending={isPostExplorePickCandidatePending}
          onSave={() =>
            postExplorePickCandidateMutation({ pickId, candidateId: explorePickData.candidateId })
          }
          redirectPath={ROUTES.EXPLORE_PICK(pickId)}
        />
      }
    />
  );
}

export default ExplorePickContent;
