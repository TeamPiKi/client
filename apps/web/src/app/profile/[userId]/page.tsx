import { notFound } from 'next/navigation';

import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { cn } from '@/utils/cn';
import { parseIdParam } from '@/utils/parseIdParam';

import ProfileEmptyState from './_components/ProfileEmptyState';
import ProfileFolderCard from './_components/ProfileFolderCard';
import ProfileSummary from './_components/ProfileSummary';
import { PROFILE_MOCK } from './_consts/profileMock';
import type { ProfileT } from './_types/profile';

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

async function ProfilePage({ params }: ProfilePageProps) {
  const userId = parseIdParam((await params).userId);
  if (userId === null) notFound();

  /** TEMP: 프로필 조회 API 연동 시 서버 조회로 교체 */
  const profile: ProfileT = { userId, ...PROFILE_MOCK };

  const isBlocked = profile.relation === 'BLOCKED';
  const isPrivate = !profile.isPublic && profile.relation !== 'ME';
  const visibleFolders = isPrivate ? [] : profile.folders;

  return (
    <main
      className={cn(
        'flex min-h-dvh flex-col pt-padding-top pb-10',
        isBlocked ? 'bg-bg-layer-default' : 'bg-bg-layer-basement'
      )}
    >
      <div className="bg-bg-layer-default pb-2">
        <Header className="px-5" left={<HeaderIcon name="BACK" className="size-7.5" />} />

        <Spacing size={18} />

        <ProfileSummary
          nickname={profile.nickname}
          profileImage={profile.profileImage}
          isFriend={profile.relation === 'FRIEND'}
          isPrivate={isPrivate}
          isBlocked={isBlocked}
        />

        {!isBlocked && (
          <>
            <Spacing size={24} />
            <h2 className="flex items-center gap-2 px-5 py-2.5 body-2-medium text-text-neutral-secondary">
              공개 폴더
              <span aria-hidden className="h-3.5 w-px bg-gray-300" />
              <span>{visibleFolders.length}개</span>
            </h2>
          </>
        )}
      </div>

      {!isBlocked && isPrivate && (
        <ProfileEmptyState basketType="lock" message="비공개 프로필이에요" />
      )}
      {!isBlocked && !isPrivate && visibleFolders.length === 0 && (
        <ProfileEmptyState basketType="default" message="아직 공개한 폴더가 없어요" />
      )}
      {!isBlocked && visibleFolders.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-1.5 gap-y-8">
          {visibleFolders.map(folder => (
            <li key={folder.id}>
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

export default ProfilePage;
