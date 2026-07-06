/** 페이지 진입 시 `?action=<value>` 로 UI/토스트 등을 실행할 때 사용 */
export const QUERY_ACTION = {
  KEY: 'action',
  VALUE: {
    OPEN_GET_ITEM_DIALOG: 'get-item',
    SHARE_RECEIPT: 'share-receipt',
    WELCOME_JOIN: 'welcome-join',
    SESSION_EXPIRED: 'session-expired',
    SOCIAL_LOGIN_ERROR: 'social-login-error',
    MEMBER_ONLY: 'member-only', // 회원 전용 경로로 redirect 하려는 경우 노출되는 안내 토스트
  },
} as const;

export type QueryActionValueT = (typeof QUERY_ACTION.VALUE)[keyof typeof QUERY_ACTION.VALUE];
