'use client';

import { useSearchParams } from 'next/navigation';

import UnderlineTab from '@/components/common/underline-tab';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { FRIEND_TAB, FRIEND_TAB_PANEL_ID, FRIEND_TAB_PATH } from '../_consts/friendTab';
import type { FriendTabT } from '../_types/friend';
import { parseFriendTabParam } from '../_utils/friendSearchParams';

type FriendTabsProps = {
  /** 로딩 중에는 없음 — "친구" 만 노출 */
  friendCount?: number;
};

/** 로딩 화면과 실제 화면이 같은 탭을 그려 로딩 전후로 탭 위치·밑줄이 바뀌지 않게 함 */
function FriendTabs({ friendCount }: FriendTabsProps) {
  const activeTab = parseFriendTabParam(useSearchParams().get('tab'));

  const handleTabChange = (tab: FriendTabT) => {
    if (tab !== activeTab) replaceUrlKeepingState(FRIEND_TAB_PATH[tab]);
  };

  return (
    <div className="px-5 pt-4">
      <UnderlineTab
        tabs={[
          {
            value: FRIEND_TAB.FRIENDS,
            label: friendCount == null ? '친구' : `친구 ${friendCount}`,
          },
          { value: FRIEND_TAB.BLOCKED, label: '차단 목록' },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        idPrefix="friend-tab"
        panelId={FRIEND_TAB_PANEL_ID}
      />
    </div>
  );
}

export default FriendTabs;
