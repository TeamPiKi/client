import { Header, HeaderIcon } from '@/components/header';

type Props = {
  title: string;
  children: React.ReactNode;
};

function ArchivePageLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-layer-basement">
      <div className="sticky top-0 z-20 inline-flex w-full flex-col items-start gap-5 bg-bg-layer-basement px-5 pt-padding-top pb-6">
        <div className="flex w-full flex-col gap-[5px]">
          <Header right={<HeaderIcon name="ALARM" />} />
          <h1 className="text-[28px] leading-[137.5%] font-bold tracking-[-0.708px] text-text-neutral-primary">
            {title}
          </h1>
        </div>
      </div>
      {children}
    </div>
  );
}

export default ArchivePageLayout;
