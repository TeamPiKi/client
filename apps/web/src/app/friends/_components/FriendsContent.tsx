'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import ConfirmDialog from '@/components/common/confirm-dialog';
import UnderlineTab from '@/components/common/underline-tab';
import { ROUTES } from '@/consts/route';
import { useDeleteFriend } from '@/hooks/useDeleteFriend';
import { useDeleteUserBlock } from '@/hooks/useDeleteUserBlock';
import { usePostUserBlock } from '@/hooks/usePostUserBlock';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { BLOCKED_USERS_MOCK } from '../_consts/friendMock';
import { FRIEND_TAB, FRIEND_TAB_PATH } from '../_consts/friendTab';
import { useGetFriends } from '../_hooks/useGetFriends';
import type { FriendT, FriendTabT } from '../_types/friend';
import { parseFriendTabParam } from '../_utils/friendSearchParams';
import BlockedUserMenu from './BlockedUserMenu';
import FriendEmptyState from './FriendEmptyState';
import FriendListItem from './FriendListItem';
import FriendMenu from './FriendMenu';

const FRIEND_TAB_PANEL_ID = 'friend-tab-panel';

function FriendsContent() {
  const searchParams = useSearchParams();
  const activeTab = parseFriendTabParam(searchParams.get('tab'));

  const router = useRouter();

  const {
    friendsData: { friendCount, friends },
  } = useGetFriends();

  /** TEMP: 목데이터 차단 해제 결과 표시용 상태라 API 연동 시 조회 쿼리로 교체함 */
  const [blockedUsers, setBlockedUsers] = useState(BLOCKED_USERS_MOCK);

  const [deleteTarget, setDeleteTarget] = useState<FriendT | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<FriendT | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  /** 확인창 취소 시 포커스를 되돌릴 행의 메뉴 버튼 (삭제·차단 후엔 행이 사라져 복원하지 않음) */
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleDialogCloseAutoFocus = (event: Event) => {
    const trigger = menuTriggerRef.current;
    menuTriggerRef.current = null;
    if (!trigger?.isConnected) return;

    event.preventDefault();
    trigger.focus();
  };

  const { deleteFriendMutation, isDeleteFriendPending } = useDeleteFriend({
    onSuccess: () => setIsDeleteDialogOpen(false),
  });

  const { postUserBlockMutation, isPostUserBlockPending } = usePostUserBlock({
    onSuccess: () => setIsBlockDialogOpen(false),
  });

  const { deleteUserBlockMutation } = useDeleteUserBlock({
    onSuccess: userId => setBlockedUsers(prev => prev.filter(user => user.userId !== userId)),
  });

  const handleTabChange = (tab: FriendTabT) => {
    if (tab !== activeTab) replaceUrlKeepingState(FRIEND_TAB_PATH[tab]);
  };

  return (
    <>
      <div className="px-5 pt-4">
        <UnderlineTab
          tabs={[
            { value: FRIEND_TAB.FRIENDS, label: `친구 ${friendCount}` },
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
                  href={ROUTES.PROFILE(friend.userId)}
                  nickname={friend.nickname}
                  profileImage={friend.profileImage}
                  description={
                    friend.folderCount != null && friend.wishCount != null
                      ? `폴더 ${friend.folderCount}개 · 위시 ${friend.wishCount}개`
                      : '비공개'
                  }
                  action={
                    <FriendMenu
                      nickname={friend.nickname}
                      onDelete={trigger => {
                        menuTriggerRef.current = trigger;
                        setDeleteTarget(friend);
                        setIsDeleteDialogOpen(true);
                      }}
                      onBlock={trigger => {
                        menuTriggerRef.current = trigger;
                        setBlockTarget(friend);
                        setIsBlockDialogOpen(true);
                      }}
                      onReport={() => router.push(ROUTES.REPORT(friend.userId))}
                    />
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
                  href={ROUTES.PROFILE(user.userId)}
                  nickname={user.nickname}
                  profileImage={user.profileImage}
                  action={
                    <BlockedUserMenu
                      nickname={user.nickname}
                      onUnblock={() => deleteUserBlockMutation(user.userId)}
                      onReport={() => router.push(ROUTES.REPORT(user.userId))}
                    />
                  }
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

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`'${deleteTarget?.nickname}' 님을 친구에서 삭제할까요?`}
        description="상대방에게 알림은 가지 않아요."
        confirmLabel="삭제하기"
        icon={null}
        isPending={isDeleteFriendPending}
        onConfirm={() => deleteTarget && deleteFriendMutation(deleteTarget.userId)}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
      <ConfirmDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        title={`'${blockTarget?.nickname}'님을 차단할까요?`}
        description="차단하면 서로의 위시를 볼 수 없어요."
        confirmLabel="차단하기"
        icon={null}
        isPending={isPostUserBlockPending}
        onConfirm={() => blockTarget && postUserBlockMutation(blockTarget.userId)}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
    </>
  );
}

export default FriendsContent;
