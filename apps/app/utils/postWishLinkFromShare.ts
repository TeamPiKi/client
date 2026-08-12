import { postTokenRefresh } from '@/apis/postTokenRefresh';

import { TokenStorage } from './tokenStorage';

/**
 * 실패 사유. 문구는 시트가 정하고 여기서는 사유만 식별한다.
 * - `unauthenticated` 토큰 없음 → 로그인 유도
 * - `sessionExpired` refresh 실패 → 로그인 유도
 * - `network` 네트워크 예외 → 재시도 가능
 * - `server` 서버 오류 → 재시도 가능
 */
export type ShareFailureReasonT = 'unauthenticated' | 'sessionExpired' | 'network' | 'server';

export type PostWishLinkFromShareResultT =
  | { ok: true }
  | {
      ok: false;
      reason: ShareFailureReasonT;
      /** 서버가 내려준 에러 코드 (로컬 판단 실패면 없음) */
      code?: string;
    };

const postWishLink = async (productUrl: string, accessToken: string) =>
  fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/wishlists`, {
    method: 'POST',
    headers: {
      'X-Client-Type': 'app',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url: productUrl }),
  });

/** 실패 응답 body 의 code 만 뽑는다. 파싱 실패는 무시 — 사유는 status 로 이미 갈렸다. */
const readErrorCode = async (response: Response) => {
  try {
    const body = (await response.json()) as { code?: string | null };
    return body.code ?? undefined;
  } catch {
    return undefined;
  }
};

/** Share Extension에서 링크로 위시 등록 */
export const postWishLinkFromShare = async (
  productUrl: string
): Promise<PostWishLinkFromShareResultT> => {
  /** 빌드 설정 누락 — 재시도해도 동일하므로 서버 오류로 묶는다 */
  if (!process.env.EXPO_PUBLIC_API_URL) return { ok: false, reason: 'server' };

  const accessToken = await TokenStorage.getAccessToken();
  const refreshToken = await TokenStorage.getRefreshToken();

  if (!accessToken) return { ok: false, reason: 'unauthenticated' };

  try {
    /** 위시 등록 시도 */
    let postWishResponse = await postWishLink(productUrl, accessToken);

    if (postWishResponse.status === 401 && refreshToken) {
      /** 토큰 만료 시 토큰 갱신 */
      const refreshResponse = await postTokenRefresh(refreshToken);

      if (!refreshResponse.ok) {
        /** 죽은 토큰으로 재시도가 반복되지 않도록 정리 */
        if (refreshResponse.status === 401) await TokenStorage.clearTokens();
        return { ok: false, reason: 'sessionExpired' };
      }

      /** 토큰 갱신 후 토큰 저장 */
      const refreshBody = (await refreshResponse.json()) as {
        data: { accessToken: string; refreshToken: string };
      };
      await TokenStorage.setTokens(refreshBody.data.accessToken, refreshBody.data.refreshToken);

      /** 위시 등록 재시도 */
      postWishResponse = await postWishLink(productUrl, refreshBody.data.accessToken);
    }

    if (!postWishResponse.ok) {
      const code = await readErrorCode(postWishResponse);
      /** refreshToken 이 없어 갱신조차 못 한 401 도 세션 만료로 본다 */
      const reason: ShareFailureReasonT =
        postWishResponse.status === 401 ? 'sessionExpired' : 'server';

      return { ok: false, reason, ...(code ? { code } : {}) };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
};
