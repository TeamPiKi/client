import { ChevronForwardIconFill, LinkIconFill } from '@/assets/icons';

type Props = {
  href: string;
};

const getSourceUrlLabel = (sourceUrl: string): string => {
  try {
    const { hostname } = new URL(sourceUrl);
    return `${hostname}에서 확인하기`;
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
      className="mt-5 flex w-full items-center gap-4 rounded-xl bg-gray-75 px-4 py-3 transition-colors active:bg-gray-100"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-layer-default">
        <LinkIconFill className="size-6 text-icon-neutral-primary" />
      </span>
      <span className="flex-1 truncate body-2-semibold text-text-neutral-secondary">{label}</span>
      <ChevronForwardIconFill className="size-6 shrink-0 text-icon-neutral-secondary" />
    </a>
  );
}

export default ItemLinkBanner;
