import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import LegalContent from '../_common/_components/LegalContent';

function PrivacyPage() {
  return (
    <main className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="개인정보 처리방침"
        centerClassName="heading-1-bold"
      />
      <Spacing size={48} />

      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-9">
        <LegalContent document="privacy" />
      </div>
    </main>
  );
}

export default PrivacyPage;
