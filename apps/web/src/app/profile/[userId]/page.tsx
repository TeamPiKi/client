import { getIsGuest } from '@/utils/auth';

import ProfileContent from './_components/ProfileContent';
import { PROFILE_MOCK } from './_consts/profileMock';
import type { ProfileT } from './_types/profile';

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const isGuest = await getIsGuest();

  /** TODO: 프로필 조회 API 연동 시 400(UUID 형식 아님) · 404(없는 사용자)는 notFound 처리 */
  /** TEMP: 프로필 조회 API 연동 시 서버 조회로 교체 */
  const profile: ProfileT = { userId, ...PROFILE_MOCK };

  return <ProfileContent profile={profile} isGuest={isGuest} />;
}

export default ProfilePage;
