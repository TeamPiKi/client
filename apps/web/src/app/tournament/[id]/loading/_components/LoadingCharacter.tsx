'use client';

import type { AnimationSegment } from 'lottie-web';
import lottie from 'lottie-web/build/player/lottie_light';
import { useEffect, useRef } from 'react';

import characterLottie from '../_assets/character-lottie.json';

const getMarkerSegment = (name: string): AnimationSegment => {
  const marker = characterLottie.markers.find(({ cm }) => cm === name);
  return marker ? [marker.tm, marker.tm + marker.dr] : [characterLottie.ip, characterLottie.op];
};

function LoadingCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: characterLottie,
    });
    container.querySelector('svg > g')?.removeAttribute('clip-path');

    const removeCompleteListener = animation.addEventListener('complete', () => {
      removeCompleteListener();
      animation.loop = true;
      animation.playSegments(getMarkerSegment('idle'), true);
    });
    animation.playSegments(getMarkerSegment('intro'), true);

    return () => animation.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="aspect-[362/423] w-full bg-white [clip-path:inset(0_round_8.287%/7.092%)]"
    />
  );
}

export default LoadingCharacter;
