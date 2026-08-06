/** Playwright webServer·baseURL·storageState origin 공통 주소 */
export const BASE_URL = 'http://localhost:3000';

/**
 * SSR 목 스텁 서버 포트.
 * playwright.config.ts 가 NEXT_PUBLIC_API_URL 을 이 주소로 강제해
 * SSR(serverApi/rewrites) 요청이 실서버 대신 스텁으로 향한다.
 */
export const MOCK_API_PORT = 4010;

export const MOCK_API_URL = `http://127.0.0.1:${MOCK_API_PORT}`;

/**
 * SSR 스텁이 빈 목록을 응답할 경로를 담는 쿠키 이름 (helpers/ssrEmpty.ts 참고).
 * 스텁은 경로당 고정 응답이라, 테스트별 '데이터 없음' 은 이 쿠키로만 표현한다.
 */
export const SSR_EMPTY_COOKIE = 'e2e-ssr-empty';
