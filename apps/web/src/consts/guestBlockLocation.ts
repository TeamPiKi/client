/**
 * 게스트 차단 지점 — 노출·CTA 클릭 이벤트의 `location` 파라미터로 실린다.
 *
 * 배너(`LOGIN_SOURCE`)와 값을 섞지 않는다. 배너는 지나가다 보는 것이고
 * 차단은 뭔가 하려다 막힌 순간이라 전환 의도가 달라, 한 차원에 담으면 배너 클릭률이 오염된다.
 */
export const GUEST_BLOCK_LOCATION = {
  /** 홈 위시 담기 카드 */
  HOME_WISH_ADD: 'home_wish_add',
  /** 홈 새 토너먼트 만들기 카드 */
  HOME_TOURNAMENT_CREATE: 'home_tournament_create',
  /** 위시 탭 */
  WISH_TAB: 'wish_tab',
  /** 토너먼트 기록 탭 */
  TOURNAMENT_TAB: 'tournament_tab',
  /** 알림 탭 */
  NOTIFICATION_TAB: 'notification_tab',
  /** 결과 화면 영수증 저장 버튼 */
  RECEIPT_SAVE: 'receipt_save',
  /** 그룹 결과 선택자 마스킹 */
  GROUP_RESULT_MASK: 'group_result_mask',
} as const;

export type GuestBlockLocationT =
  (typeof GUEST_BLOCK_LOCATION)[keyof typeof GUEST_BLOCK_LOCATION];
