'use client';

import { getImageProps } from 'next/image';
import { useEffect, useRef } from 'react';

import { PRODUCT_CARD_IMAGE_SIZES } from '../_consts/image';

/** 로딩 페이지에서는 1라운드 후보를, 매치 화면에서는 라운드별 `remainingItems`를 프리로드한다. */
const usePreloadMatchImages = (imageUrls: (string | null | undefined)[]) => {
  const preloadedUrlsRef = useRef<Set<string>>(new Set());
  const pendingImagesRef = useRef<Set<HTMLImageElement>>(new Set());

  const urlsKey = imageUrls.filter(Boolean).join('|');

  useEffect(() => {
    if (!urlsKey) return;

    const pendingImages = pendingImagesRef.current;

    urlsKey.split('|').forEach(imageUrl => {
      if (preloadedUrlsRef.current.has(imageUrl)) return;
      preloadedUrlsRef.current.add(imageUrl);

      const { props } = getImageProps({
        src: imageUrl,
        alt: '',
        fill: true,
        sizes: PRODUCT_CARD_IMAGE_SIZES,
      });

      const image = new Image();
      /** 현재 매치 이미지와 대역폭을 다투지 않도록 낮은 우선순위로 */
      image.fetchPriority = 'low';

      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;

      image.onload = () => {
        pendingImages.delete(image);
      };
      /** 실패한 URL은 제거해 다음 진입 시 재시도한다. */
      image.onerror = () => {
        pendingImages.delete(image);

        preloadedUrlsRef.current.delete(imageUrl);
      };

      pendingImages.add(image);
      image.src = props.src;
    });
  }, [urlsKey]);
};

export default usePreloadMatchImages;
