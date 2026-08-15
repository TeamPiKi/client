export const ITEM_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  /** 추출이 일부 필드만 채운 상태. 사용자가 나머지를 채우면 READY 가 된다 */
  INCOMPLETE: 'INCOMPLETE',
  FAILED: 'FAILED',
} as const;
