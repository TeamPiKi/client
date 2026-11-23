'use client';

import { useRouter } from 'next/navigation';

import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';

import type { ProfileT } from '../_types/profile';
import ProfileActions from './ProfileActions';
import ProfileEmptyState from './ProfileEmptyState';
import ProfileFolderCard from './ProfileFolderCard';
import ProfileMenu from './ProfileMenu';
import ProfileSummary from './ProfileSummary';

type ProfileContentProps = {
  profile: ProfileT;
};

function ProfileContent({ profile }: ProfileContentProps) {
  const router = useRouter();

  /** 차단 프로필 여부 */
  const isBlocked = profile.relation === 'BLOCKED';
  /** 친구 프로필 여부 */
  const isFriend = profile.relation === 'FRIEND';
  /** 비공개 프로필 여부 */
  const isPrivate = profile.foldersHidden && !isBlocked;
  /**
   * 헤더 우측 메뉴 노출 여부
   *
   * - 노출하지 않는 경우: 내 프로필, 차단한 프로필
   */
  const showMoreMenu = profile.relation === 'NOT_FRIEND' || isFriend;
  /**
   * 프로필 하단 액션 버튼 노출 여부
   *
   * - 내 프로필인 경우
   * - 차단한 프로필인 경우
   * - 친구가 아니면서 공개 프로필인 경우
   */
  const showActionButton =
    profile.relation === 'SELF' || isBlocked || (profile.relation === 'NOT_FRIEND' && !isPrivate);

  /** TODO: 친구 추가 동작 연결 */
  const handleAddFriend = () => {};
  /** TODO: 차단 · 친구 삭제 확인 모달과 차단 해제 동작 연결 */
  const handleBlock = () => {};
  const handleDeleteFriend = () => {};
  const handleUnblock = () => {};

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
                onDeleteFriend={handleDeleteFriend}
                onBlock={handleBlock}
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
              relation={profile.relation}
              onAddFriend={handleAddFriend}
              onUnblock={handleUnblock}
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
              <ProfileFolderCard
                name={folder.name}
                wishCount={folder.wishCount}
                thumbnailUrls={folder.coverImageUrls}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default ProfileContent;
