'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useRef, useState } from 'react';

import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { wishesCountQueryOptions } from '@/apis/getWishesCount';
import { ChevronBackwardIconFill, CloseCircularIconFill } from '@/assets/icons';
import Basket from '@/components/common/basket';
import NextPageStatus from '@/components/common/next-page-status';
import PullToRefresh from '@/components/common/pull-to-refresh';
import WishGrid from '@/components/common/wish-grid';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Header } from '@/components/header';
import Input from '@/components/input';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/utils/cn';
import { refetchFirstPage } from '@/utils/refetchFirstPage';

import { useSearchWishes } from '../_hooks/useSearchWishes';

type WishSearchProps = {
  onClose: () => void;
};

function WishSearch({ onClose }: WishSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  const {
    searchWishesData,
    searchWishesCountData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isSearchWishesPending,
  } = useSearchWishes(submittedKeyword);
  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError
  );

  const isSearching = isFocused || submittedKeyword === null;

  const queryClient = useQueryClient();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pullToRefresh = usePullToRefresh(
    () => {
      const request = { q: submittedKeyword ?? '' };
      return Promise.all([
        refetchFirstPage(queryClient, wishesInfiniteQueryOptions(request).queryKey),
        queryClient.refetchQueries(
          { queryKey: wishesCountQueryOptions(request).queryKey },
          { throwOnError: true }
        ),
      ]);
    },
    { enabled: !isSearching, scrollerRef }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setSubmittedKeyword(trimmedKeyword);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setKeyword('');
    inputRef.current?.focus();
  };

  return (
    <Dialog
      open
      onOpenChange={isOpen => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        ref={scrollerRef}
        showCloseButton={false}
        showOverlay={false}
        onOpenAutoFocus={event => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className={cn(
          'inset-0 w-full max-w-none translate-x-0 translate-y-0 rounded-none p-0',
          isSearching ? 'bg-transparent' : 'overflow-y-auto bg-bg-layer-basement'
        )}
      >
        <DialogDescription className="sr-only">
          상품명을 입력하고 검색하면 일치하는 위시를 보여줘요.
        </DialogDescription>
        <div
          className={cn(
            'sticky top-0 mx-auto flex w-full max-w-120 flex-col gap-[21px] rounded-b-3xl px-5 pt-padding-top pb-[21px] transition-colors',
            isSearching ? 'bg-bg-layer-default' : 'bg-bg-layer-basement'
          )}
        >
          <Header
            left={
              <button
                type="button"
                aria-label="뒤로가기"
                onClick={onClose}
                className="cursor-pointer"
              >
                <ChevronBackwardIconFill className="size-7.5 text-icon-neutral-secondary" />
              </button>
            }
            center={
              <DialogTitle asChild>
                <h1 className="heading-1-bold text-text-neutral-primary">내 위시 검색</h1>
              </DialogTitle>
            }
          />
          <form role="search" onSubmit={handleSubmit}>
            <Input
              ref={inputRef}
              enterKeyHint="search"
              aria-label="상품명 검색"
              placeholder="상품명을 입력해주세요."
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              right={
                keyword && (
                  <button
                    type="button"
                    aria-label="검색어 지우기"
                    onMouseDown={event => event.preventDefault()}
                    onClick={handleClear}
                    className="flex cursor-pointer"
                  >
                    <CloseCircularIconFill className="size-5" />
                  </button>
                )
              }
            />
          </form>
        </div>

        {isSearching && (
          <div aria-hidden className="fixed inset-0 -z-10 bg-black/20" onClick={onClose} />
        )}
        {!isSearching && <PullToRefresh {...pullToRefresh} />}
        {!isSearching && !isSearchWishesPending && (
          <section
            aria-live="polite"
            className="mx-auto flex w-full max-w-120 flex-col gap-6 pt-1 pb-10"
          >
            <p className="px-5 body-2-medium text-text-neutral-tertiary">
              검색 결과 {searchWishesCountData ?? searchWishesData.length}개
            </p>
            {searchWishesData.length > 0 ? (
              <>
                <WishGrid wishes={searchWishesData} />
                <NextPageStatus
                  ref={bottomRef}
                  isFetching={isFetchingNextPage}
                  isError={isFetchNextPageError}
                  onRetry={fetchNextPage}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 pt-12.5">
                <Basket type="panic" />
                <p className="body-1-medium text-text-neutral-secondary">일치하는 상품이 없어요.</p>
              </div>
            )}
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WishSearch;
