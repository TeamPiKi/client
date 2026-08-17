/**
 * 매치 상품 카드 이미지의 `sizes`.
 *
 * next/image 는 이 값과 기기 DPR 로 srcset 후보 중 하나를 골라
 * `/_next/image?url=...&w=<선택된 폭>&q=75` 를 요청한다.
 * 프리로드가 실제 렌더와 같은 URL 을 받아오려면(= 브라우저 캐시 키 일치)
 * ProductCard 와 프리로드 훅이 반드시 같은 값을 써야 해서 상수로 뽑았다.
 */
export const PRODUCT_CARD_IMAGE_SIZES = '(max-width: 480px) 45vw, 200px';
