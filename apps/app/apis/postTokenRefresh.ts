/** 토큰 갱신 타임아웃 — 부팅이 이 요청에 묶여있어 네트워크가 멈추면 무한 대기하므로 제한 */
const REFRESH_TIMEOUT_MS = 5000;

/** 네이티브 토큰 갱신 — 응답(Response)을 그대로 반환, 처리는 호출부에서 (타임아웃 시 throw) */
export const postTokenRefresh = (refreshToken: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  return fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/token/refresh`, {
    method: 'POST',
    headers: {
      'X-Client-Type': 'app',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
};
