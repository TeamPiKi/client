import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { getApiErrorStatus } from '@/utils/apiError';
import { getIsGuest } from '@/utils/auth';
import { getQueryClient } from '@/utils/queryClient';

import { getProfile, profileQueryOptions } from './_apis/getProfile';
import ProfileContent from './_components/ProfileContent';

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const isGuest = await getIsGuest();
  const queryClient = getQueryClient();

  try {
    const profileData = await getProfile(userId);
    queryClient.setQueryData(profileQueryOptions(userId).queryKey, profileData);
  } catch (error) {
    const status = getApiErrorStatus(error);

    /** 400: UUID 형식 아님 · 404: 없거나 탈퇴한 사용자 */
    if (status === 400 || status === 404) notFound();

    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileContent userId={userId} isGuest={isGuest} />
    </HydrationBoundary>
  );
}

export default ProfilePage;
