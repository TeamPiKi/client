'use client';

import { useEffect, useRef } from 'react';

import { loadMatchImage } from '../_utils/loadMatchImage';

/** 매치 화면에서 라운드별 `remainingItems`를 프리로드한다. */
const usePreloadMatchImages = (imageUrls: (string | null | undefined)[]) => {
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  const urlsKey = imageUrls.filter(Boolean).join('|');

  useEffect(() => {
    if (!urlsKey) return;

    urlsKey.split('|').forEach(imageUrl => {
      if (preloadedUrlsRef.current.has(imageUrl)) return;
      preloadedUrlsRef.current.add(imageUrl);

      /** 현재 매치 이미지와 대역폭을 다투지 않도록 낮은 우선순위로 */
      loadMatchImage(imageUrl, 'low').then(isLoaded => {
        /** 실패한 URL은 제거해 다음 진입 시 재시도한다. */
        if (!isLoaded) preloadedUrlsRef.current.delete(imageUrl);
      });
    });
  }, [urlsKey]);
};

export default usePreloadMatchImages;
