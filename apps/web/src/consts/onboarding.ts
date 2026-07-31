const ONBOARDING_KEY_PREFIX = 'piki:onboarding:';

export const ONBOARDING_KEY = {
  /** 스플래시 이후 로그인 진입 전 슬라이드 */
  INTRO: `${ONBOARDING_KEY_PREFIX}intro:v1`,
} as const;

export type OnboardingKeyT = (typeof ONBOARDING_KEY)[keyof typeof ONBOARDING_KEY];
