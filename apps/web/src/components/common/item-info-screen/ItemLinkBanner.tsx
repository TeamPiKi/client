'use client';

import { useState } from 'react';

import { ChevronForwardIconFill, LinkIconFill } from '@/assets/icons';

type ItemLinkBannerProps = {
  href: string;
};

/** 사이트 파비콘 직접 로드 → 실패 시 구글 faviconV2 → 그래도 실패 시 기존 링크 아이콘 */
const getSourceUrlParts = (sourceUrl: string) => {
  try {
    const { hostname, origin } = new URL(sourceUrl);
    return {
      label: hostname,
      faviconSrcs: [
        `${origin}/apple-touch-icon.png`, // 보통 180×180 — favicon.ico(16~32px)보다 고해상도
        `${origin}/favicon.ico`,
        `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=128`,
      ],
    };
  } catch {
    return { label: sourceUrl, faviconSrcs: [] };
  }
};

/** 상품 이미지 위에 겹쳐 두는 원본 링크 칩 */
function ItemLinkBanner({ href }: ItemLinkBannerProps) {
  const [faviconIndex, setFaviconIndex] = useState(0);

  const { label, faviconSrcs } = getSourceUrlParts(href);
  const faviconSrc = faviconSrcs[faviconIndex];

  const handleFaviconError = () => setFaviconIndex(prev => prev + 1);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass absolute bottom-4 left-4 flex max-w-[calc(100%-32px)] items-center gap-2 rounded-full p-1 pr-2"
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-neutral-muted bg-bg-layer-default">
        {faviconSrc ? (
          // 임의 외부 도메인이라 next/image remotePatterns 등록이 불가능해 일반 img 사용
          // eslint-disable-next-line @next/next/no-img-element
          <img
            // 하이드레이션 전에 로드가 이미 실패한 이미지는 onError가 다시 발생하지 않으므로 여기서 감지
            ref={img => {
              if (img?.complete && img.naturalWidth === 0) handleFaviconError();
            }}
            src={faviconSrc}
            alt=""
            className="size-full object-cover"
            onError={handleFaviconError}
          />
        ) : (
          <LinkIconFill className="size-5 text-icon-neutral-primary" />
        )}
      </span>
      <span className="truncate body-2-medium text-text-neutral-secondary">{label}</span>
      <ChevronForwardIconFill className="size-4 shrink-0 text-icon-neutral-primary" />
    </a>
  );
}

export default ItemLinkBanner;
