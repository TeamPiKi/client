/**
 * 목 데이터에서 쓰는 가짜 이미지 URL.
 * 실제로 존재하지 않는 주소이며, 아무도 여기에 접속하지 않는다 —
 * mockApiFixture 가 `/_next/image` 요청과 이 CDN 주소 요청을 가로채
 * 아래 MOCK_IMAGE_MAP 의 로컬 이미지로 응답한다.
 */
export const MOCK_IMAGE_URLS = {
  avatar: 'https://cdn.example/e2e/avatar.png',
  product: 'https://cdn.example/e2e/product.png',
} as const;

/** 용도를 눈으로 구분할 수 있게 색·라벨이 다른 단색 SVG 를 만든다 */
const createMockImageSvg = (label: string, backgroundColor: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">` +
  `<rect width="160" height="160" fill="${backgroundColor}"/>` +
  `<text x="80" y="86" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#ffffff">${label}</text>` +
  `</svg>`;

/** 가짜 URL → 응답할 이미지 본문. 등록되지 않은 URL 은 DEFAULT_MOCK_IMAGE 로 응답 */
export const MOCK_IMAGE_MAP: Record<string, string> = {
  [MOCK_IMAGE_URLS.avatar]: createMockImageSvg('AVATAR', '#60a5fa'),
  [MOCK_IMAGE_URLS.product]: createMockImageSvg('PRODUCT', '#fbbf24'),
};

export const DEFAULT_MOCK_IMAGE = createMockImageSvg('IMG', '#9ca3af');
