'use client';

import { usePostExploreWish } from '../_hooks/usePostExploreWish';
import SaveHeartButton from './SaveHeartButton';

type WishHeartButtonProps = {
  wishId: number;
  isInMyWish: boolean;
  savedWishId: number | null;
};

function WishHeartButton({ wishId, isInMyWish, savedWishId }: WishHeartButtonProps) {
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  return (
    <SaveHeartButton
      isInMyWish={isInMyWish}
      savedWishId={savedWishId}
      isPending={isPostExploreWishPending}
      onSave={() => postExploreWishMutation(wishId)}
    />
  );
}

export default WishHeartButton;
