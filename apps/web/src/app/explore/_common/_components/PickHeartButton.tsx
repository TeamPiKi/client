'use client';

import { usePostExplorePickCandidate } from '../_hooks/usePostExplorePickCandidate';
import SaveHeartButton from './SaveHeartButton';

type PickHeartButtonProps = {
  pickId: number;
  candidateId: number;
  isInMyWish: boolean;
  savedWishId: number | null;
};

function PickHeartButton({ pickId, candidateId, isInMyWish, savedWishId }: PickHeartButtonProps) {
  const { postExplorePickCandidateMutation, isPostExplorePickCandidatePending } =
    usePostExplorePickCandidate();

  return (
    <SaveHeartButton
      isInMyWish={isInMyWish}
      savedWishId={savedWishId}
      isPending={isPostExplorePickCandidatePending}
      onSave={() => postExplorePickCandidateMutation({ pickId, candidateId })}
    />
  );
}

export default PickHeartButton;
