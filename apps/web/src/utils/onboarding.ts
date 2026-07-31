import type { OnboardingKeyT } from '@/consts/onboarding';

/** 온보딩 열람 여부 판단 */
export const hasSeenOnboarding = (key: OnboardingKeyT) => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};

/** 온보딩 열람 여부 표시 */
export const markOnboardingSeen = (key: OnboardingKeyT) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, '1');
  } catch {
    /** private mode 등 — 무시 */
  }
};
