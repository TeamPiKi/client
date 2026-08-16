import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';

import EditForm from './_components/EditForm';

function MypageEditPage() {
  return (
    <div className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">프로필 수정</h1>}
      />

      <Spacing size={60} />

      <EditForm />
    </div>
  );
}

export default MypageEditPage;
