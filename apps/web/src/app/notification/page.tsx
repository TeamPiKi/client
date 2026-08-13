import { Header, HeaderIcon } from '@/components/header';

import NotificationContent from './_components/NotificationContent';

function Notification() {
  return (
    <div className="flex h-dvh flex-col bg-gray-50 px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="알림 히스토리"
        centerClassName="heading-1-bold"
      />

      <div className="mt-4 hide-scrollbar flex-1 overflow-y-auto">
        <NotificationContent />
      </div>
    </div>
  );
}

export default Notification;
