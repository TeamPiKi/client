export const ITEMS_PER_BASKET = 8;
export const BASKET_COUNT = 4;

/**
 * 담기 전 바구니 개수를 전달하기 위한 쿼리 키
 * 재진입 후 생성된 바구니와 기존 바구니를 구분하기 위해 사용
 */
export const PREV_ITEM_COUNT_KEY = 'prevItemCount';

/** 매인 캐러셀 너비가 화면에서 차지하는 퍼센트 (인접 바구니는 100% - 이 값만큼 뺀 나머지 너비를 인접 바구니가 차지) */
export const BASKET_CAROUSEL_SLIDE_SIZE_PERCENT = 90;
