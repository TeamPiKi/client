import { ChevronForwardIconFill, LinkIconFill } from '@/assets/icons';

type Props = {
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

function ItemLinkBanner({ href }: Props) {
  const label = getSourceUrlLabel(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass absolute bottom-4 left-4 flex items-center gap-2 rounded-full py-1 pr-2 pl-1"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border-neutral-muted bg-bg-layer-basement">
        <LinkIconFill className="size-5 text-icon-neutral-primary" />
      </span>
      <span className="inline-flex flex-1 items-center gap-1 truncate body-2-medium text-text-neutral-secondary">
        {label}

        <ChevronForwardIconFill className="size-4 shrink-0 text-icon-neutral-primary" />
      </span>
    </a>
  );
}

export default ItemLinkBanner;
