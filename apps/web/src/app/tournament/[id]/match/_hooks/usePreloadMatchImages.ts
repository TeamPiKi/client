'use client';

import { getImageProps } from 'next/image';
import { useEffect, useRef } from 'react';

import { PRODUCT_CARD_IMAGE_SIZES } from '../_consts/image';

/**
 * 다음 대진은 기록 응답(nextMatch)으로만 알 수 있어 미리 조회할 수 없다.
 * 대신 그 라운드에 남은 아이템(remainingItems)은 이미 알고 있으므로,
 * 라운드 진입 시점에 후보 이미지를 전부 브라우저 캐시에 올려둔다.
 * → 어떤 조합이 나와도 스켈레톤이 걷힐 때 이미 받아둔 이미지가 그려진다.
 *
 * 캐시 키는 URL 문자열이고, 실제 렌더는 원본 URL 이 아니라
 * `/_next/image?url=...&w=...&q=75` 를 요청한다. 그래서 원본 URL 로 프리로드하면
 * 키가 어긋나 캐시 미스가 된다 — getImageProps 로 렌더와 동일한 srcSet/sizes 를 얻어
 * 브라우저가 렌더 때와 같은 후보를 고르게 한다.
 */
const usePreloadMatchImages = (imageUrls: (string | null | undefined)[]) => {
  /** 이미 요청한 URL — 라운드가 바뀌어도 중복 요청하지 않는다 */
  const preloadedUrlsRef = useRef<Set<string>>(new Set());
  /** 로드 완료 전 GC 로 요청이 취소되지 않도록 인스턴스를 붙잡아 둔다 */
  const pendingImagesRef = useRef<Set<HTMLImageElement>>(new Set());

  /** 배열 참조가 매 렌더 바뀌므로 내용 기준으로 의존성을 만든다 */
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
      /** srcset·sizes 를 src 보다 먼저 — 순서가 바뀌면 src 로 먼저 요청이 나간다 */
      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;

      const release = () => pendingImages.delete(image);
      image.onload = release;
      image.onerror = release;

      pendingImages.add(image);
      image.src = props.src;
    });

    return () => {
      /** 언마운트 시 진행 중인 프리로드는 정리 — 남은 요청은 브라우저가 취소한다 */
      pendingImages.forEach(image => {
        image.onload = null;
        image.onerror = null;
      });
      pendingImages.clear();
    };
  }, [urlsKey]);
};

export default usePreloadMatchImages;
