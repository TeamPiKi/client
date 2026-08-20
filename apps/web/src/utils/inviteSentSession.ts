/**
 * 주최자가 "초대 링크 보내기" 를 한 번이라도 눌렀는지 토너먼트 단위로 저장한다.
 *
 * 담기 마감 카운트다운 / 마감 모달은 협업 의도가 표명된 토너먼트에만 적용한다.
 * - 한 번도 안 보냈고 참여자도 본인뿐이면 혼자 천천히 담는 시나리오라 타이머 의미 없음
 * - 친구가 합류했다면 (`participants.length > 1`) localStorage 없이도 타이머 ON
 *
 * SSR 환경에서는 `window` 가 없으므로 안전 가드.
 */
const STORAGE_KEY_PREFIX = 'piki:inviteSent:';

const getStorageKey = (tournamentId: number) => `${STORAGE_KEY_PREFIX}${tournamentId}`;

export const hasSentInvite = (tournamentId: number): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(getStorageKey(tournamentId)) === '1';
  } catch {
    return false;
  }
};

export const markInviteSent = (tournamentId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getStorageKey(tournamentId), '1');
  } catch {
    /* private mode 등 — 무시 */
  }
};

export const clearInviteSent = (tournamentId: number): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getStorageKey(tournamentId));
  } catch {
    /* private mode 등 — 무시 */
  }
};
