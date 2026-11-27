'use client';

import { usePostExplorePickCandidate } from '../_hooks/usePostExplorePickCandidate';
import SaveHeartButton from './SaveHeartButton';

type PickHeartButtonProps = {
  pickId: number;
  candidateId: number;
  isInMyWish: boolean;
};

function PickHeartButton({ pickId, candidateId, isInMyWish }: PickHeartButtonProps) {
  const { postExplorePickCandidateMutation, isPostExplorePickCandidatePending } =
    usePostExplorePickCandidate();

  return (
    <SaveHeartButton
      isInMyWish={isInMyWish}
      isPending={isPostExplorePickCandidatePending}
      onSave={() => postExplorePickCandidateMutation({ pickId, candidateId })}
    />
  );
}

export default PickHeartButton;
