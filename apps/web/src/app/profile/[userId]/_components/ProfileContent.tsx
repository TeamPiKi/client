'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import ConfirmDialog from '@/components/common/confirm-dialog';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { ROUTES } from '@/consts/route';
import { useDeleteFriend } from '@/hooks/useDeleteFriend';
import { useDeleteUserBlock } from '@/hooks/useDeleteUserBlock';
import { usePostUserBlock } from '@/hooks/usePostUserBlock';
import { cn } from '@/utils/cn';
import { getLoginPath } from '@/utils/loginRedirect';

import { usePostFriend } from '../_hooks/usePostFriend';
import type { ProfileT } from '../_types/profile';
import ProfileActions from './ProfileActions';
import ProfileEmptyState from './ProfileEmptyState';
import ProfileFolderCard from './ProfileFolderCard';
import ProfileMenu from './ProfileMenu';
import ProfileSummary from './ProfileSummary';

type ProfileContentProps = {
  profile: ProfileT;
  isGuest: boolean;
};

function ProfileContent({ profile, isGuest }: ProfileContentProps) {
  const router = useRouter();

  /** TEMP: 목데이터 친구 추가·삭제·차단 결과 표시용 상태라 API 연동 시 조회 쿼리 갱신으로 교체 */
  const [relation, setRelation] = useState(profile.relation);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  /** 차단 프로필 여부 */
  const isBlocked = relation === 'BLOCKED';
  /** 친구 프로필 여부 */
  const isFriend = relation === 'FRIEND';
  /** 비공개 프로필 여부 */
  const isPrivate = profile.foldersHidden && !isBlocked;
  /**
   * 헤더 우측 메뉴 노출 여부
   *
   * - 노출하지 않는 경우: 내 프로필, 차단한 프로필
   */
  const showMoreMenu = relation === 'NOT_FRIEND' || isFriend;
  /**
   * 프로필 하단 액션 버튼 노출 여부
   *
   * - 내 프로필인 경우
   * - 차단한 프로필인 경우
   * - 친구가 아니면서 공개 프로필인 경우
   */
  const showActionButton =
    relation === 'SELF' || isBlocked || (relation === 'NOT_FRIEND' && !isPrivate);

  /**
   * TODO: 친구 추가 후 바로 친구 상태로 바뀌는 게 맞는지 확인 후 진행
   * @see https://www.figma.com/design/NlgTPUvrwaHNDcBy33bDf2/%F0%9F%94%B5-%EC%9E%91%EB%8B%B9%EB%AA%A8%EC%9D%98-v2?node-id=4419-32437
   */
  const { postFriendMutation, isPostFriendPending } = usePostFriend({
    onSuccess: () => setRelation('FRIEND'),
  });
  const { deleteFriendMutation, isDeleteFriendPending } = useDeleteFriend({
    onSuccess: () => {
      setRelation('NOT_FRIEND');
      setIsDeleteDialogOpen(false);
    },
  });
  const { postUserBlockMutation, isPostUserBlockPending } = usePostUserBlock({
    onSuccess: () => {
      setRelation('BLOCKED');
      setIsBlockDialogOpen(false);
    },
  });
  const { deleteUserBlockMutation, isDeleteUserBlockPending } = useDeleteUserBlock({
    onSuccess: () => setRelation('NOT_FRIEND'),
  });

  const handleDialogCloseAutoFocus = (event: Event) => {
    const trigger = menuTriggerRef.current;
    menuTriggerRef.current = null;
    if (!trigger?.isConnected) return;

    event.preventDefault();
    trigger.focus();
  };

  return (
    <main
      className={cn(
        'flex min-h-dvh flex-col pb-10',
        isBlocked ? 'bg-bg-layer-default' : 'bg-bg-layer-basement'
      )}
    >
      <div className="bg-bg-layer-default pt-padding-top pb-2">
        <Header
          className="px-5"
          left={<HeaderIcon name="BACK" className="size-7.5" />}
          right={
            showMoreMenu && (
              <ProfileMenu
                nickname={profile.nickname}
                isFriend={isFriend}
                isGuest={isGuest}
                onLoginRequired={() => setIsLoginDialogOpen(true)}
                onDeleteFriend={trigger => {
                  menuTriggerRef.current = trigger;
                  setIsDeleteDialogOpen(true);
                }}
                onBlock={trigger => {
                  menuTriggerRef.current = trigger;
                  setIsBlockDialogOpen(true);
                }}
                onReport={() => router.push(ROUTES.REPORT(profile.userId))}
              />
            )
          }
        />

        <Spacing size={18} />

        <ProfileSummary
          nickname={profile.nickname}
          profileImage={profile.profileImage}
          isFriend={isFriend}
          isPrivate={isPrivate}
          isBlocked={isBlocked}
        />

        {showActionButton && (
          <>
            <Spacing size={24} />
            <ProfileActions
              relation={relation}
              isPending={isPostFriendPending || isDeleteUserBlockPending}
              onAddFriend={() =>
                isGuest ? setIsLoginDialogOpen(true) : postFriendMutation(profile.userId)
              }
              onUnblock={() => deleteUserBlockMutation(profile.userId)}
            />
          </>
        )}

        {!isBlocked && (
          <>
            <Spacing size={showActionButton ? 24 : 38} />
            <h2 className="flex items-center gap-2 px-5 py-2.5 body-2-medium text-text-neutral-secondary">
              공개 폴더
              <span aria-hidden className="h-3.5 w-px bg-gray-300" />
              <span>{profile.folders.length}개</span>
            </h2>
          </>
        )}
      </div>

      {!isBlocked && isPrivate && (
        <ProfileEmptyState basketType="lock" message="비공개 프로필이에요" />
      )}
      {!isBlocked && !isPrivate && profile.folders.length === 0 && (
        <ProfileEmptyState basketType="default" message="아직 공개한 폴더가 없어요" />
      )}
      {!isBlocked && profile.folders.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-1.5 gap-y-8">
          {profile.folders.map(folder => (
            <li key={folder.folderId}>
              <Link
                href={
                  relation === 'SELF'
                    ? ROUTES.WISHLIST_FOLDER(folder.folderId)
                    : ROUTES.EXPLORE_FOLDER(profile.userId, folder.folderId)
                }
                className="block"
              >
                <ProfileFolderCard
                  name={folder.name}
                  wishCount={folder.wishCount}
                  thumbnailUrls={folder.coverImageUrls}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`'${profile.nickname}' 님을 친구에서 삭제할까요?`}
        description="상대방에게 알림은 가지 않아요."
        confirmLabel="삭제하기"
        icon={null}
        isPending={isDeleteFriendPending}
        onConfirm={() => deleteFriendMutation(profile.userId)}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
      <ConfirmDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        title={`'${profile.nickname}'님을 차단할까요?`}
        description="차단하면 서로의 위시를 볼 수 없어요."
        confirmLabel="차단하기"
        icon={null}
        isPending={isPostUserBlockPending}
        onConfirm={() => postUserBlockMutation(profile.userId)}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
      <ConfirmDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        title="로그인이 필요해요"
        description={`로그인하고 '${profile.nickname}'님을 친구로 추가해 보세요.`}
        cancelLabel="그냥 볼래요"
        confirmLabel="로그인하기"
        icon={null}
        onConfirm={() => router.push(getLoginPath(ROUTES.PROFILE(profile.userId)))}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
    </main>
  );
}

export default ProfileContent;
