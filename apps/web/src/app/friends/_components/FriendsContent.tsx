'use client';

import { useSearchParams } from 'next/navigation';

import UnderlineTab from '@/components/common/underline-tab';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { BLOCKED_USERS_MOCK, FRIENDS_MOCK } from '../_consts/friendMock';
import { FRIEND_TAB, FRIEND_TAB_PATH } from '../_consts/friendTab';
import type { FriendTabT } from '../_types/friend';
import { parseFriendTabParam } from '../_utils/friendSearchParams';
import FriendEmptyState from './FriendEmptyState';
import FriendListItem from './FriendListItem';

const FRIEND_TAB_PANEL_ID = 'friend-tab-panel';

function FriendsContent() {
  const searchParams = useSearchParams();
  const activeTab = parseFriendTabParam(searchParams.get('tab'));

  const friends = FRIENDS_MOCK;
  const blockedUsers = BLOCKED_USERS_MOCK;

  const handleTabChange = (tab: FriendTabT) => {
    if (tab !== activeTab) replaceUrlKeepingState(FRIEND_TAB_PATH[tab]);
  };

  return (
    <>
      <div className="px-5 pt-4">
        <UnderlineTab
          tabs={[
            { value: FRIEND_TAB.FRIENDS, label: `친구 ${friends.length}` },
            { value: FRIEND_TAB.BLOCKED, label: '차단 목록' },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          idPrefix="friend-tab"
          panelId={FRIEND_TAB_PANEL_ID}
        />
      </div>

      <div id={FRIEND_TAB_PANEL_ID} role="tabpanel" aria-labelledby={`friend-tab-${activeTab}`}>
        {activeTab === FRIEND_TAB.FRIENDS &&
          (friends.length > 0 ? (
            <ul className="flex flex-col gap-1.5 pt-7">
              {friends.map(friend => (
                <FriendListItem
                  key={friend.userId}
                  nickname={friend.nickname}
                  profileImage={friend.profileImage}
                  description={
                    friend.isPublic
                      ? `폴더 ${friend.folderCount}개 · 위시 ${friend.wishCount}개`
                      : '비공개'
                  }
                />
              ))}
            </ul>
          ) : (
            <FriendEmptyState
              title="아직 친구가 없어요"
              description="친구를 추가하고 서로의 위시를 구경해 보세요"
            />
          ))}

        {activeTab === FRIEND_TAB.BLOCKED &&
          (blockedUsers.length > 0 ? (
            <ul className="flex flex-col gap-1.5 pt-7">
              {blockedUsers.map(user => (
                <FriendListItem
                  key={user.userId}
                  nickname={user.nickname}
                  profileImage={user.profileImage}
                />
              ))}
            </ul>
          ) : (
            <FriendEmptyState
              title="차단한 사용자가 없어요"
              description="차단한 사용자는 이곳에서 확인할 수 있어요"
            />
          ))}
      </div>
    </>
  );
}

export default FriendsContent;
