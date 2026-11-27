'use client';

import { usePostExploreWish } from '../_hooks/usePostExploreWish';
import SaveHeartButton from './SaveHeartButton';

type WishHeartButtonProps = {
  wishId: number;
  isInMyWish: boolean;
};

function WishHeartButton({ wishId, isInMyWish }: WishHeartButtonProps) {
  const { postExploreWishMutation, isPostExploreWishPending } = usePostExploreWish();

  return (
    <SaveHeartButton
      isInMyWish={isInMyWish}
      isPending={isPostExploreWishPending}
      onSave={() => postExploreWishMutation(wishId)}
    />
  );
}

export default WishHeartButton;
