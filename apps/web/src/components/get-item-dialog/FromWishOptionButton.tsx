'use client';

import { HeartIconFill } from '@/assets/icons';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import OptionButton from './OptionButton';

type FromWishOptionButtonProps = {
  tournamentId: number;
};

function FromWishOptionButton({ tournamentId }: FromWishOptionButtonProps) {
  const { userData } = useGetMe();

  if (userData.identityType !== 'MEMBER') return null;

  return (
    <OptionButton
      href={ROUTES.TOURNAMENT_ADD_ITEM_BY_WISH(tournamentId)}
      label="위시에서 가져오기"
      description="내 위시리스트에서 상품을 가져와요"
      Icon={HeartIconFill}
    />
  );
}

export default FromWishOptionButton;
