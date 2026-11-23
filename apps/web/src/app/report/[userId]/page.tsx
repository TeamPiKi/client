import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import ReportForm from './_components/ReportForm';

function ReportPage() {
  return (
    <main className="flex h-dvh flex-col bg-bg-layer-default pt-padding-top">
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">신고하기</h1>}
      />

      <Spacing size={28} />

      <ReportForm />
    </main>
  );
}

export default ReportPage;
