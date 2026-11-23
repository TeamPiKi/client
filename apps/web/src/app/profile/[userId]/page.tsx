import { notFound } from 'next/navigation';

import { parseIdParam } from '@/utils/parseIdParam';

import ProfileContent from './_components/ProfileContent';
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

  return <ProfileContent profile={profile} />;
}

export default ProfilePage;
