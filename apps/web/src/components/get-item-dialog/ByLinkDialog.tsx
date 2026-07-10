'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { usePostTournamentItemLink } from '@/app/tournament/[id]/create/_hooks/usePostTournamentItemLink';
import { LinkIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import Input from '@/components/input';
import { ROUTES } from '@/consts/route';
import { usePostWishLink } from '@/hooks/usePostWishLink';
import type { ItemTypeT } from '@/types/item';

const URL_PATTERN = /^https:\/\/.+/i;

type ByLinkProps = {
  type: ItemTypeT;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ByLinkDialog({ type, open, onOpenChange }: ByLinkProps) {
  const router = useRouter();
  const { id: tournamentId } = useParams<{ id: string }>();
  const { postWishLinkMutation, isPostWishLinkPending } = usePostWishLink();
  const { postTournamentItemLinkMutation, isPostTournamentItemLinkPending } =
    usePostTournamentItemLink(Number(tournamentId));

  const [url, setUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  const trimmedUrl = url.trim();
  const isEmpty = trimmedUrl.length === 0;
  const isPending = isPostWishLinkPending || isPostTournamentItemLinkPending;

  const resetState = () => {
    setUrl('');
    setHasError(false);
  };

  const handleSubmit = () => {
    if (isEmpty) return;

    if (!URL_PATTERN.test(trimmedUrl)) {
      setHasError(true);
      return;
    }

    if (type === 'wish')
      postWishLinkMutation(trimmedUrl, {
        onSettled: () => {
          onOpenChange(false);
          resetState();
        },
        onSuccess: () => {
          router.push(ROUTES.ARCHIVE('wish'));
        },
      });
    else
      postTournamentItemLinkMutation(trimmedUrl, {
        onSettled: () => {
          onOpenChange(false);
          resetState();
        },
      });
  };

  const handleChange = (value: string) => {
    setUrl(value);
    if (hasError) setHasError(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-5 rounded-3xl">
        <DialogTitle className="text-center heading-1 text-text-neutral-primary">
          링크로 담기
        </DialogTitle>
        <DialogDescription className="sr-only">상품 URL을 입력해 담습니다.</DialogDescription>
        <div className="flex flex-col gap-4">
          <Input
            label="링크 URL"
            placeholder="복사한 링크를 입력해주세요."
            value={url}
            onChange={event => handleChange(event.target.value)}
            left={<LinkIconFill className="size-5" />}
            aria-invalid={hasError}
            {...(hasError ? { helperText: 'https://로 시작하는 URL을 입력해주세요.' } : {})}
            autoFocus
          />
          <Button
            size="lg"
            variant="primary"
            disabled={isEmpty}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            {type === 'wish' && '위시리스트에 담기'}
            {type === 'tournament' && '후보 바구니에 담기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ByLinkDialog;
