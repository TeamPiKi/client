'use client';

import { type FormEvent, useRef, useState } from 'react';

import { ChevronBackwardIconFill, CloseCircularIconFill } from '@/assets/icons';
import BasketGuestIcon from '@/assets/images/basket-guest.svg';
import WishGrid from '@/components/common/wish-grid';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Header } from '@/components/header';
import Input from '@/components/input';
import type { WishListItemT } from '@/types/wish';
import { cn } from '@/utils/cn';

type WishSearchProps = {
  wishes: WishListItemT[];
  onClose: () => void;
};

function WishSearch({ wishes, onClose }: WishSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  /** TODO: API 연동 시 위시 검색 API 로 교체 */
  const results =
    submittedKeyword === null
      ? []
      : wishes.filter(({ item }) =>
          item.name?.toLowerCase().includes(submittedKeyword.toLowerCase())
        );
  const isSearching = isFocused || submittedKeyword === null;

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
            'sticky top-0 mx-auto flex w-full max-w-120 flex-col gap-6 rounded-b-3xl px-5 pt-padding-top pb-[23px] transition-colors',
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

        {isSearching ? (
          <div aria-hidden className="fixed inset-0 -z-10 bg-black/20" onClick={onClose} />
        ) : (
          <section
            aria-live="polite"
            className="mx-auto flex w-full max-w-120 flex-col gap-6 pt-1 pb-10"
          >
            <p className="px-5 body-2-medium text-text-neutral-tertiary">
              검색 결과 {results.length}개
            </p>
            {results.length > 0 ? (
              <WishGrid wishes={results} />
            ) : (
              <div className="flex flex-col items-center gap-4 pt-12.5">
                <BasketGuestIcon width={60} height={60} aria-hidden />
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
