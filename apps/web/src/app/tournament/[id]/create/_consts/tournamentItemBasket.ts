export const ITEMS_PER_BASKET = 8;
export const BASKET_COUNT = 4;

/**
 * 담기 전 아이템 개수를 전달하기 위한 sessionStorage 키
 * 재진입 시점의 기존 아이템 개수를 전달해 새로 생긴 바구니인지 구분하기 위해 사용
 */
export const PREV_ITEM_COUNT_KEY = 'prevItemCount';

/** 매인 캐러셀 너비가 화면에서 차지하는 퍼센트 (인접 바구니는 100% - 이 값만큼 뺀 나머지 너비를 인접 바구니가 차지) */
export const BASKET_CAROUSEL_SLIDE_SIZE_PERCENT = 80;

/** 카트와 그 아래 개수 라벨 사이 간격(px) */
export const BASKET_STACK_GAP = 16;
