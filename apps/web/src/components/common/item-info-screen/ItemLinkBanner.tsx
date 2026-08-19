'use client';

import { useState } from 'react';

import { ChevronForwardIconFill, LinkIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

type ItemLinkBannerProps = {
  sourceUrl: string;
  sourcePlatform: string | null;
};

/** 파비콘 후보 — 고해상도 순. 전부 실패하면 링크 아이콘으로 폴백 */
const getSourceUrlParts = (sourceUrl: string) => {
  try {
    const { hostname, origin } = new URL(sourceUrl);
    return {
      label: hostname,
      faviconSrcs: [
        `${origin}/apple-touch-icon.png`,
        `${origin}/favicon.ico`,
        `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=128`,
      ],
    };
  } catch {
    return { label: sourceUrl, faviconSrcs: [] };
  }
};

/** 상품 이미지 위에 겹쳐 두는 원본 링크 칩 */
function ItemLinkBanner({ sourceUrl, sourcePlatform }: ItemLinkBannerProps) {
  const [faviconIndex, setFaviconIndex] = useState(0);
  const [isFaviconLoaded, setIsFaviconLoaded] = useState(false);

  const { label: hostLabel, faviconSrcs } = getSourceUrlParts(sourceUrl);
  const label = sourcePlatform ?? hostLabel;
  const faviconSrc = faviconSrcs[faviconIndex];

  const handleFaviconError = () => setFaviconIndex(prev => prev + 1);
  const handleFaviconLoad = () => setIsFaviconLoaded(true);

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass absolute bottom-4 left-4 flex max-w-[calc(100%-32px)] items-center gap-2 rounded-full p-1 pr-2"
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-neutral-muted bg-bg-layer-default">
        {!isFaviconLoaded && <LinkIconFill className="size-5 text-icon-neutral-primary" />}
        {faviconSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- next/image는 .ico 미지원
          <img
            /** 하이드레이션 전에 로드가 끝나면 onLoad/onError가 오지 않아 ref에서 보정 */
            ref={img => {
              if (!img?.complete) return;
              if (img.naturalWidth === 0) handleFaviconError();
              else handleFaviconLoad();
            }}
            src={faviconSrc}
            alt=""
            className={cn('absolute inset-0 size-full object-cover', !isFaviconLoaded && 'invisible')}
            onLoad={handleFaviconLoad}
            onError={handleFaviconError}
          />
        )}
      </span>
      <span className="truncate body-2-medium text-text-neutral-secondary">{label}</span>
      <ChevronForwardIconFill className="size-4 shrink-0 text-icon-neutral-primary" />
    </a>
  );
}

export default ItemLinkBanner;
