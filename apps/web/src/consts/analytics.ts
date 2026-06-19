/**
 * GA4 / Firebase Analytics 이벤트 상수.
 *
 * 네이밍 규칙: snake_case, 40자 이내.
 * 파라미터: PII 금지(이메일/닉네임/실명), ID 만 보낸다.
 */
export const ANALYTICS_EVENT = {
  /** 핵심 funnel */
  SIGN_UP_COMPLETE: 'sign_up_complete',
  WISH_ADD: 'wish_add',
  TOURNAMENT_CREATE: 'tournament_create',
  TOURNAMENT_START: 'tournament_start',
  TOURNAMENT_COMPLETE: 'tournament_complete',

  /** 사용자 행동 */
  FRIEND_INVITE_SEND: 'friend_invite_send',
  FRIEND_JOIN: 'friend_join',
  RECEIPT_SHARE: 'receipt_share',
  PLAY_LINK_SHARE: 'play_link_share',
  INVITE_EXPIRY_CHANGE: 'invite_expiry_change',
} as const;

export type AnalyticsEventNameT = (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];
