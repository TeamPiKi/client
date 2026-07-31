'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/carousel';
import { ONBOARDING_KEY } from '@/consts/onboarding';
import { ROUTES } from '@/consts/route';
import { markOnboardingSeen } from '@/utils/onboarding';

import { ONBOARDING_SLIDES } from '../_consts/onboardingSlide';
import OnboardingIndicator from './OnboardingIndicator';

function OnboardingClient() {
  const router = useRouter();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextClick = () => {
    if (currentIndex !== ONBOARDING_SLIDES.length - 1) {
      carouselApi?.scrollNext();
      return;
    }

    /** 온보딩 통과 시점에 기록 — 이후 스플래시는 로그인으로 바로 진입 */
    markOnboardingSeen(ONBOARDING_KEY.INTRO);
    router.replace(ROUTES.LOGIN);
  };

  useEffect(() => {
    router.prefetch(ROUTES.LOGIN);
  }, [router]);

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

  return (
    <main className="flex min-h-dvh flex-col bg-gray-50 px-5 pt-padding-top pb-9">
      <Carousel
        className="grid min-h-0 w-full flex-1"
        setApi={setCarouselApi}
        opts={{ loop: false, align: 'start' }}
      >
        <CarouselContent className="ml-0 h-full">
          {ONBOARDING_SLIDES.map(({ subCopy, mainCopy, Illust }) => (
            <CarouselItem key={subCopy} className="flex h-full flex-col items-center pl-0">
              <div className="mt-15 flex flex-col items-center gap-[11px]">
                <p className="text-center body-1-semibold text-sky-blue-400">{subCopy}</p>
                <h1 className="text-center title-1 whitespace-pre-line text-text-neutral-primary">
                  {mainCopy}
                </h1>
              </div>

              <div className="mt-10 flex min-h-0 w-full flex-1 items-center justify-center">
                <Illust aria-hidden className="max-h-full max-w-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-6 flex flex-col items-center gap-6">
        <OnboardingIndicator
          totalCount={ONBOARDING_SLIDES.length}
          currentIndex={currentIndex}
          onSelect={index => carouselApi?.scrollTo(index)}
        />

        <Button variant="primary" size="lg" onClick={handleNextClick}>
          다음
        </Button>
      </div>
    </main>
  );
}

export default OnboardingClient;
