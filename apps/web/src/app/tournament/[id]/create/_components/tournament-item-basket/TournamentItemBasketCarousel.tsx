'use client';

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/carousel';
import useContainerHeight from '@/hooks/useContainerHeight';
import { cn } from '@/utils/cn';

import type { TournamentPendingItemT } from '../../../_common/_types/tournamentResponse';
import {
  BASKET_CAROUSEL_SLIDE_SIZE_PERCENT,
  ITEMS_PER_BASKET,
} from '../../_consts/tournamentItemBasket';
import { getActiveBasketCount, getBasketIndexForLastItem } from '../../_utils/tournamentItemBasket';
import CarouselIndicator from './CarouselIndicator';
import TournamentItemBasket from './TournamentItemBasket';

type TournamentItemBasketCarouselProps = {
  items?: TournamentPendingItemT[];
  scrollToLast?: boolean;
  /** 위시 담기 등 재진입 시점의 기존 바구니 개수 */
  previousItemCount?: number;
  isDepositClosed?: boolean;
  participantImageMap?: Map<string, string>;
};

function TournamentItemBasketCarousel({
  items = [],
  scrollToLast = false,
  previousItemCount,
  isDepositClosed = false,
  participantImageMap,
}: TournamentItemBasketCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBasketCount = useMemo(() => getActiveBasketCount(items.length), [items.length]);

  /** 재진입 시 이미 생성된 바구니는 제외하고 증가 여부를 판단하기 위해 이전 개수를 기준으로 비교 */
  const prevBasketCountRef = useRef(
    previousItemCount === undefined ? activeBasketCount : getActiveBasketCount(previousItemCount)
  );
  useEffect(() => {
    if (activeBasketCount > prevBasketCountRef.current) {
      toast.info('카트가 꽉 찼어요! 새 카트를 만들었어요.');
    }
    prevBasketCountRef.current = activeBasketCount;
  }, [activeBasketCount]);

  const prevItemCountRef = useRef(scrollToLast ? 0 : items.length);

  const isCarouselEnabled = activeBasketCount > 1;

  /** 담기 완료 시 마지막 아이템이 있는 바구니로 이동 (링크 담기: 실시간 / 위시 담기: 페이지 재진입) */
  useEffect(() => {
    if (!isCarouselEnabled) {
      prevItemCountRef.current = items.length;
      return;
    }

    if (!carouselApi) return;

    if (items.length > prevItemCountRef.current) {
      carouselApi.scrollTo(getBasketIndexForLastItem(items.length));
    }

    prevItemCountRef.current = items.length;
  }, [carouselApi, isCarouselEnabled, items.length]);

  /** 초기 이미지 위치 틀어짐 방지 */
  useLayoutEffect(() => {
    if (!carouselApi || !isCarouselEnabled) return;

    carouselApi.reInit();
    carouselApi.scrollTo(carouselApi.selectedScrollSnap(), true);
  }, [carouselApi, activeBasketCount, isCarouselEnabled]);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());

    const handleReInit = () => {
      carouselApi.scrollTo(carouselApi.selectedScrollSnap(), true);
    };

    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleReInit);

    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleReInit);
    };
  }, [carouselApi]);

  const handleIndicatorSelect = (index: number) => carouselApi?.scrollTo(index);

  const { ref: containerRef, height: containerHeight } = useContainerHeight();
  const { ref: indicatorRef, height: indicatorHeight } = useContainerHeight();
  const gap = isCarouselEnabled ? 16 : 0;
  let basketMaxHeight: number | undefined;
  if (containerHeight) {
    basketMaxHeight = isCarouselEnabled
      ? containerHeight - (indicatorHeight ?? 0) - gap
      : containerHeight;
  }

  if (!isCarouselEnabled) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-0 w-full flex-1 flex-col items-center justify-start px-5"
      >
        <TournamentItemBasket
          basketIndex={0}
          items={items}
          isDepositClosed={isDepositClosed}
          maxHeight={basketMaxHeight}
          participantImageMap={participantImageMap}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 w-full flex-1 flex-col items-center justify-start gap-4"
    >
      <Carousel
        key={activeBasketCount}
        className={cn('relative w-full', !carouselApi && 'invisible')}
        setApi={setCarouselApi}
        opts={{ loop: false, align: 'center', containScroll: false }}
      >
        <CarouselContent className="ml-0 w-full">
          {Array.from({ length: activeBasketCount }, (_, i) => (
            <CarouselItem
              key={i}
              className="shrink-0 grow-0 pl-0"
              style={{ flex: `0 0 ${BASKET_CAROUSEL_SLIDE_SIZE_PERCENT}%` }}
            >
              <TournamentItemBasket
                basketIndex={i}
                items={items.slice(i * ITEMS_PER_BASKET, (i + 1) * ITEMS_PER_BASKET)}
                isDepositClosed={isDepositClosed}
                maxHeight={basketMaxHeight}
                participantImageMap={participantImageMap}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div ref={indicatorRef}>
        <CarouselIndicator
          totalCount={activeBasketCount}
          currentIndex={currentIndex}
          onSelect={handleIndicatorSelect}
        />
      </div>
    </div>
  );
}

export default memo(TournamentItemBasketCarousel);
