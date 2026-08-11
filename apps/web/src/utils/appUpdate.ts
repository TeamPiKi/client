/** 목표 버전이 오르면 같은 세션에서도 다시 노출되도록 키에 버전을 포함한다 */
const getDismissKey = (targetVersion: string) => `piki:app-update:${targetVersion}`;

/** 이번 앱 실행(세션)에서 업데이트 유도 모달을 닫았는지 — sessionStorage 는 앱 종료 시 비워진다 */
export const hasDismissedAppUpdate = (targetVersion: string) => {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(getDismissKey(targetVersion)) === '1';
  } catch {
    return false;
  }
};

/** 업데이트 유도 모달 닫음 표시 */
export const markAppUpdateDismissed = (targetVersion: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(getDismissKey(targetVersion), '1');
  } catch {
    /** private mode 등 — 무시 */
  }
};
