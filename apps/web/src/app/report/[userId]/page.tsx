import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import ReportForm from './_components/ReportForm';

type ReportPageProps = {
  params: Promise<{ userId: string }>;
};

async function ReportPage({ params }: ReportPageProps) {
  const { userId } = await params;

  return (
    <main className="flex h-dvh flex-col bg-bg-layer-default pt-padding-top">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">신고하기</h1>}
      />

      <Spacing size={28} />

      <ReportForm userId={userId} />
    </main>
  );
}

export default ReportPage;
