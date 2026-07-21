'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { HeartIconFill, ImageIconFill, LinkIconFill } from '@/assets/icons';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
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
  const { userData } = useGetMe();
  const [isSubDialogOpen, setIsSubDialogOpen] = useState<'link' | 'image' | null>(null);

  const { id } = useParams<{ id: string }>();
  const tournamentId = parseIdParam(id);

  if (type === 'tournament' && !tournamentId) return null;

  return (
    <>
      <DialogContent showCloseButton={false} className="flex flex-col gap-[15px]">
        <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
          위시템 담기
        </DialogTitle>
        <DialogDescription className="sr-only">
          위시, 링크, 이미지 중 하나를 선택해 상품을 담습니다.
        </DialogDescription>

        <ul className="flex w-full flex-col gap-2">
          {type === 'tournament' && userData.identityType === 'MEMBER' && (
            <OptionButton
              href={ROUTES.TOURNAMENT_ADD_ITEM_BY_WISH(tournamentId ?? -1)}
              label="위시에서 가져오기"
              description="내 위시리스트에서 상품을 가져와요"
              Icon={HeartIconFill}
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
    </>
  );
}

export default GetItemDialogContent;
