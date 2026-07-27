'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { usePostTournamentItemLink } from '@/app/tournament/[id]/create/_hooks/usePostTournamentItemLink';
import { LinkIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import Input from '@/components/input';
import { usePostWishLink } from '@/hooks/usePostWishLink';
import type { ItemTypeT } from '@/types/item';
import { URL_PATTERN, extractUrlFromText } from '@/utils/extractUrl';

type ByLinkProps = {
  type: ItemTypeT;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ByLinkDialog({ type, open, onOpenChange }: ByLinkProps) {
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

    // 상품 설명과 URL 이 함께 붙여넣어진 경우 URL 만 추출해 제출한다 (onPaste 를 타지 않은 경로 안전망).
    const submitUrl = URL_PATTERN.test(trimmedUrl) ? trimmedUrl : extractUrlFromText(trimmedUrl);

    if (!submitUrl) {
      setHasError(true);
      return;
    }

    /** 닫기/초기화는 성공 시에만 — 실패 시 URL을 고칠 수 있게 유지. 위시리스트 이동은 usePostWishLink 훅이 조건부로 처리 */
    if (type === 'wish')
      postWishLinkMutation(submitUrl, {
        onSuccess: () => {
          onOpenChange(false);
          resetState();
        },
      });
    else
      postTournamentItemLinkMutation(submitUrl, {
        onSuccess: () => {
          onOpenChange(false);
          resetState();
        },
      });
  };

  const handleChange = (value: string) => {
    setUrl(value);
    if (hasError) setHasError(false);
  };

  /** 상품 설명 + URL 형태로 붙여넣으면 URL 만 입력창에 반영한다 */
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const extractedUrl = extractUrlFromText(event.clipboardData.getData('text'));
    if (!extractedUrl) return;

    event.preventDefault();
    handleChange(extractedUrl);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-5 rounded-3xl">
        <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
          링크로 담기
        </DialogTitle>
        <DialogDescription className="sr-only">상품 URL을 입력해 담습니다.</DialogDescription>
        <div className="flex flex-col gap-4">
          <Input
            label="링크 URL"
            placeholder="복사한 링크를 입력해주세요."
            value={url}
            onChange={event => handleChange(event.target.value)}
            onPaste={handlePaste}
            left={<LinkIconFill className="size-5" />}
            aria-invalid={hasError}
            {...(hasError ? { helperText: '올바른 URL 형식으로 입력해주세요.' } : {})}
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
