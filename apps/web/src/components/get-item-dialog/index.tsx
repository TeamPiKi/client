'use client';

import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { WishlistPageT } from '@/apis/getWishlist';
import { getWishlist } from '@/apis/getWishlist';
import { HeartIconFill, ImageIconFill, LinkIconFill } from '@/assets/icons';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';
import type { ItemTypeT } from '@/types/item';
import { parseIdParam } from '@/utils/parseIdParam';

import ByImageDialog from './ByImageDialog';
import ByLinkDialog from './ByLinkDialog';
import OptionButton from './OptionButton';

type GetItemDialogContentProps = {
  type: ItemTypeT;
};

function GetItemDialogContent({ type }: GetItemDialogContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData } = useGetMe();
  const [isSubDialogOpen, setIsSubDialogOpen] = useState<'link' | 'image' | 'no-wish' | null>(null);

  const { id } = useParams<{ id: string }>();
  const tournamentId = parseIdParam(id);
  const isWishOptionVisible = type === 'tournament' && userData.identityType === 'MEMBER';

  /** 클릭 시점에 위시 유무를 즉시 판단할 수 있도록 미리 받아둔다 */
  useEffect(() => {
    if (!isWishOptionVisible) return;

    queryClient.prefetchInfiniteQuery({
      queryKey: ['wishlists'],
      queryFn: ({ pageParam }) => getWishlist(pageParam as string | null),
      initialPageParam: null as string | null,
      getNextPageParam: (page: WishlistPageT) => (page.hasNext ? page.nextCursor : null),
    });
  }, [isWishOptionVisible, queryClient]);

  if (type === 'tournament' && !tournamentId) return null;

  const handleWishClick = () => {
    const cached = queryClient.getQueryData<InfiniteData<WishlistPageT>>(['wishlists']);

    if (cached && cached.pages.every(page => page.items.length === 0)) {
      setIsSubDialogOpen('no-wish');
      return;
    }

    router.push(ROUTES.TOURNAMENT_ADD_ITEM_BY_WISH(tournamentId ?? -1));
  };

  return (
    <>
      <DialogContent showCloseButton={false} className="flex flex-col gap-[15px]">
        <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
          위시 담기
        </DialogTitle>
        <DialogDescription className="sr-only">
          위시, 링크, 이미지 중 하나를 선택해 상품을 담습니다.
        </DialogDescription>

        <ul className="flex w-full flex-col gap-2">
          {isWishOptionVisible && (
            <OptionButton
              label="위시에서 가져오기"
              description="내 위시리스트에서 상품을 가져와요"
              Icon={HeartIconFill}
              onClick={handleWishClick}
            />
          )}
          <OptionButton
            label="링크로 담기"
            description="상품URL을 붙여넣어요"
            Icon={LinkIconFill}
            onClick={() => setIsSubDialogOpen('link')}
          />
          <OptionButton
            label="이미지로 담기"
            description="스크린샷을 첨부해요"
            Icon={ImageIconFill}
            onClick={() => setIsSubDialogOpen('image')}
          />
        </ul>
      </DialogContent>

      <ByLinkDialog
        type={type}
        open={isSubDialogOpen === 'link'}
        onOpenChange={open => setIsSubDialogOpen(open ? 'link' : null)}
      />
      <ByImageDialog
        type={type}
        open={isSubDialogOpen === 'image'}
        onOpenChange={open => setIsSubDialogOpen(open ? 'image' : null)}
      />
      <TournamentErrorDialog
        type="NO_WISH_EXISTS"
        open={isSubDialogOpen === 'no-wish'}
        onOpenChange={open => setIsSubDialogOpen(open ? 'no-wish' : null)}
      />
    </>
  );
}

export default GetItemDialogContent;
