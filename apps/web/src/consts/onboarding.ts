const ONBOARDING_KEY_PREFIX = 'piki:onboarding:';

export const ONBOARDING_KEY = {
  /** 스플래시 이후 로그인 진입 전 슬라이드 */
  INTRO: `${ONBOARDING_KEY_PREFIX}intro:v1`,
  /** 홈 첫 진입 시 공유 익스텐션으로 위시 담는 법 안내 */
  HOME: `${ONBOARDING_KEY_PREFIX}home:v1`,
} as const;

export type OnboardingKeyT = (typeof ONBOARDING_KEY)[keyof typeof ONBOARDING_KEY];
