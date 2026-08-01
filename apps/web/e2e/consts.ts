/** Playwright webServer·baseURL·storageState origin 공통 주소 */
export const BASE_URL = 'http://localhost:3000';

/**
 * SSR 목 스텁 서버 포트.
 * playwright.config.ts 가 NEXT_PUBLIC_API_URL 을 이 주소로 강제해
 * SSR(serverApi/rewrites) 요청이 실서버 대신 스텁으로 향한다.
 */
export const MOCK_API_PORT = 4010;

export const MOCK_API_URL = `http://127.0.0.1:${MOCK_API_PORT}`;
