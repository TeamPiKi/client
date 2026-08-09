import { ChevronForwardIconFill, LinkIconFill } from '@/assets/icons';

type ItemLinkBannerProps = {
  href: string;
};

const getSourceUrlLabel = (sourceUrl: string): string => {
  try {
    const { hostname } = new URL(sourceUrl);
    return hostname;
  } catch {
    return sourceUrl;
  }
};

/** 상품 이미지 위에 겹쳐 두는 원본 링크 칩 */
function ItemLinkBanner({ href }: ItemLinkBannerProps) {
  const label = getSourceUrlLabel(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass absolute bottom-4 left-4 flex max-w-[calc(100%-32px)] items-center gap-2 rounded-full p-1 pr-2"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border-neutral-muted bg-bg-layer-basement">
        <LinkIconFill className="size-5 text-icon-neutral-primary" />
      </span>
      <span className="truncate body-2-medium text-text-neutral-secondary">{label}</span>
      <ChevronForwardIconFill className="size-4 shrink-0 text-icon-neutral-primary" />
    </a>
  );
}

export default ItemLinkBanner;
