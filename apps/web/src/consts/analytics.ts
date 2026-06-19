/**
 * GA4 / Firebase Analytics 이벤트 상수.
 *
 * 네이밍 규칙: snake_case, 40자 이내.
 * 파라미터: PII 금지(이메일/닉네임/실명), ID 만 보낸다.
 *
 * funnel 페어 정책:
 *  - `*_start`  사용자가 액션을 시작한 시점 (클릭 등) — 도달률 측정
 *  - `*_complete` API 성공 / 최종 도달 — 완료율 측정
 */
export const ANALYTICS_EVENT = {
  /** 가입 / 인증 */
  SIGN_UP_COMPLETE: 'sign_up_complete',

  /** 위시 등록 funnel */
  WISH_ADD_START: 'wish_add_start',
  WISH_ADD_COMPLETE: 'wish_add_complete',

  /** 토너먼트 funnel */
  TOURNAMENT_CREATE: 'tournament_create',
  TOURNAMENT_START: 'tournament_start',
  RESULT_VIEW: 'result_view',
  RESULT_SHARE_CLICK: 'result_share_click',
  RECEIPT_SHARE: 'receipt_share',

  /** 친구 초대 funnel */
  SOCIAL_INVITE_CLICK: 'social_invite_click',
  FRIEND_INVITE_SEND: 'friend_invite_send',
  FRIEND_JOIN: 'friend_join',
  GUEST_VISIT: 'guest_visit',

  /** 설정 */
  INVITE_EXPIRY_CHANGE: 'invite_expiry_change',
} as const;

export type AnalyticsEventNameT = (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];
