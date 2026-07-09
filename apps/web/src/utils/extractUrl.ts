/** 사용자 입력/공유 텍스트의 URL 유효성 패턴 — http/https 허용 */
export const URL_PATTERN = /^https?:\/\/.+/i;

/**
 * 텍스트에서 첫 번째 http(s) URL 을 추출한다.
 *
 * 쇼핑몰 앱·웹에서 상품 링크를 복사하면 "상품명/설명 + URL" 이 함께 담기는 경우가 많아,
 * 링크 입력·공유 흐름에서 URL 만 뽑아내는 용도.
 *
 * ex) "[제작]쿨링 리본 미니원피스\nhttps://s.zigzag.kr/XWnpU1fuZx" → "https://s.zigzag.kr/XWnpU1fuZx"
 *
 * trailing 구두점(`)`, `,`, `.`)은 문장 안에 URL 이 섞였을 때 따라붙는 잔여물이라 제거
 * (앱 ShareBottomSheet 의 추출 로직과 동일 규칙).
 */
export const extractUrlFromText = (text: string): string | null => {
  const matched = text.match(/https?:\/\/[^\s]+/i)?.[0];
  if (!matched) return null;

  return matched.replace(/[),.]+$/, '');
};
