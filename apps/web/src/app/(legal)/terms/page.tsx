import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import LegalContent from '../_common/_components/LegalContent';

function TermsPage() {
  return (
    <main className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="서비스 이용약관"
        centerClassName="heading-1-bold"
      />
      <Spacing size={48} />

      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-9">
        <LegalContent document="terms" />
      </div>
    </main>
  );
}

export default TermsPage;
