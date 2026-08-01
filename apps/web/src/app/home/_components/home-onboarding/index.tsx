'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { CloseIconFill } from '@/assets/icons';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/carousel';
import OnboardingIndicator from '@/components/common/onboarding-indicator';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/dialog';
import { ONBOARDING_KEY } from '@/consts/onboarding';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import { hasSeenOnboarding, markOnboardingSeen } from '@/utils/onboarding';

import { getOnboardingSlides } from '../../_consts/onboarding';

function HomeOnboarding() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  /** 현재 슬라이드 인덱스 */
  const [currentIndex, setCurrentIndex] = useState(0);
  /** 모달 닫힘 여부 */
  const [isClosed, setIsClosed] = useState(false);
  /** 온보딩 기록 여부 */
  const [hasSeen] = useState(() => hasSeenOnboarding(ONBOARDING_KEY.HOME));

  /** 슬라이드 시작 위치 */
  const dragStartXRef = useRef(0);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  /** 모달 노출 여부 */
  const isOpen = isMounted && !hasSeen && !isClosed;
  // const isOpen = isMounted && isWebview() && !hasSeen && !isClosed;
  /** 슬라이드 목록 - iOS/android 분기 */
  const slides = getOnboardingSlides(isMounted && /android/i.test(window.navigator.userAgent));
  // const slides = getOnboardingSlides(isInApp && /android/i.test(window.navigator.userAgent));

  /** 중간에 닫아도 다시 뜨지 않도록 노출 시점에 기록 */
  useEffect(() => {
    if (!isOpen) return;

    markOnboardingSeen(ONBOARDING_KEY.HOME);
  }, [isOpen]);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());

    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);

  /** 첫·마지막 슬라이드에서 바깥 방향으로 슬라이드 불가능하도록 설정 */
  useEffect(() => {
    if (!carouselApi) return;

    const viewport = carouselApi.rootNode();
    const lastIndex = slides.length - 1;

    const handlePointerDown = (event: PointerEvent) => {
      dragStartXRef.current = event.clientX;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.buttons === 0) return;

      const deltaX = event.clientX - dragStartXRef.current;
      if (Math.abs(deltaX) < 5) return;

      const selectedIndex = carouselApi.selectedScrollSnap();
      const isDraggingToPrev = deltaX > 0;
      const isDraggingToNext = deltaX < 0;

      if (selectedIndex === 0 && isDraggingToPrev) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (selectedIndex === lastIndex && isDraggingToNext) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove, { passive: false, capture: true });

    return () => {
      viewport.removeEventListener('pointerdown', handlePointerDown);
      viewport.removeEventListener('pointermove', handlePointerMove, { capture: true });
    };
  }, [carouselApi, slides.length]);

  return (
    <Dialog open={isOpen} onOpenChange={open => setIsClosed(!open)}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[334px] gap-0 overflow-hidden rounded-3xl p-0"
        style={{ zIndex: Z_INDEX.HOME_ONBOARDING }}
        onInteractOutside={event => event.preventDefault()}
      >
        <DialogTitle className="sr-only">링크 공유로 위시 담는 방법</DialogTitle>

        <Carousel
          className="relative min-w-0"
          setApi={setCarouselApi}
          opts={{ loop: false, align: 'start', containScroll: 'keepSnaps' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[286px] bg-sky-blue-200"
          />
          <CarouselContent className="relative z-10 ml-0">
            {slides.map(({ title, description, Illust, illustClassName }) => (
              <CarouselItem key={title} className="pl-0">
                <div className="flex h-[286px] justify-center overflow-hidden">
                  <div className="relative h-full w-full shrink-0">
                    <Illust aria-hidden className={cn('absolute', illustClassName)} />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 px-5 pt-[30px]">
                  <h2 className="text-center heading-1-bold text-text-neutral-primary">{title}</h2>
                  <p className="text-center body-1-medium whitespace-pre-line text-text-neutral-secondary">
                    {description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center pt-[30px] pb-[34px]">
          <OnboardingIndicator
            totalCount={slides.length}
            currentIndex={currentIndex}
            onSelect={index => carouselApi?.scrollTo(index)}
          />
        </div>

        <DialogClose asChild>
          <button autoFocus type="button" className="absolute top-2 right-3 cursor-pointer p-2.5">
            <CloseIconFill className="size-6 text-white" />
            <span className="sr-only">닫기</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default HomeOnboarding;
