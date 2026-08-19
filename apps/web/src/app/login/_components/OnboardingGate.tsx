'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ONBOARDING_KEY } from '@/consts/onboarding';
import { ROUTES } from '@/consts/route';
import { hasSeenOnboarding } from '@/utils/onboarding';

function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    if (hasSeenOnboarding(ONBOARDING_KEY.INTRO)) return;

    router.replace(ROUTES.ONBOARDING);
  }, [router]);

  return null;
}

export default OnboardingGate;
