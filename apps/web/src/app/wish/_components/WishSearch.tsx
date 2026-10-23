'use client';

import { type FormEvent, useRef, useState } from 'react';

import { ChevronBackwardIconFill, CloseCircularIconFill } from '@/assets/icons';
import BasketGuestIcon from '@/assets/images/basket-guest.svg';
import { Header } from '@/components/header';
import Input from '@/components/input';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import WishGrid from '../_common/_components/WishGrid';
import type { WishListItemT } from '../_common/_types/wish';

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

  /** NOTE: 아래 전체 위시 탭 레이아웃을 건드리지 않도록 그 위에 고정 레이어로 덮음 */
  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 mx-auto flex w-full max-w-120 flex-col',
        isSearching ? 'pointer-events-none' : 'bottom-0 overflow-y-auto bg-bg-layer-basement'
      )}
      style={{ zIndex: Z_INDEX.STICKY_HEADER + 1 }}
    >
      <div
        className={cn(
          'pointer-events-auto sticky top-0 flex flex-col gap-6 rounded-b-3xl px-5 pt-padding-top pb-[23px] transition-colors',
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
              <ChevronBackwardIconFill className="size-7.5 text-text-neutral-primary" />
            </button>
          }
          center={<h1 className="heading-1-bold text-text-neutral-primary">내 위시 검색</h1>}
        />
        <form role="search" onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            aria-label="상품명 검색"
            placeholder="상품명을 입력해주세요."
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
            right={
              keyword &&
              !isFocused && (
                <button
                  type="button"
                  aria-label="검색어 지우기"
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
        <div
          aria-hidden
          className="pointer-events-auto fixed inset-0 -z-10 bg-black/20"
          onClick={onClose}
        />
      ) : (
        <section aria-live="polite" className="flex flex-col gap-6 pt-1 pb-46">
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
    </div>
  );
}

export default WishSearch;
