import { postTokenRefresh } from '@/apis/postTokenRefresh';

import { TokenStorage } from './tokenStorage';

type PostWishLinkFromShareResultT = { ok: true } | { ok: false; message: string };

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

/** Share Extension에서 링크로 위시 등록 */
export const postWishLinkFromShare = async (
  productUrl: string
): Promise<PostWishLinkFromShareResultT> => {
  if (!process.env.EXPO_PUBLIC_API_URL)
    return { ok: false, message: 'API 주소가 설정되지 않았어요' };

  const accessToken = await TokenStorage.getAccessToken();
  const refreshToken = await TokenStorage.getRefreshToken();

  if (!accessToken) return { ok: false, message: '로그인이 필요해요' };

  try {
    /** 위시 등록 시도 */
    let postWishResponse = await postWishLink(productUrl, accessToken);

    if (postWishResponse.status === 401 && refreshToken) {
      /** 토큰 만료 시 토큰 갱신 */
      const refreshResponse = await postTokenRefresh(refreshToken);

      if (!refreshResponse.ok) {
        /** 죽은 토큰으로 재시도가 반복되지 않도록 정리 */
        if (refreshResponse.status === 401) await TokenStorage.clearTokens();
        return { ok: false, message: '로그인이 만료됐어요' };
      }

      /** 토큰 갱신 후 토큰 저장 */
      const refreshBody = (await refreshResponse.json()) as {
        data: { access_token: string; refresh_token: string };
      };
      await TokenStorage.setTokens(refreshBody.data.access_token, refreshBody.data.refresh_token);

      /** 위시 등록 재시도 */
      postWishResponse = await postWishLink(productUrl, refreshBody.data.access_token);
    }

    if (!postWishResponse.ok) return { ok: false, message: '요청 처리 중 오류가 발생했습니다.' };

    return { ok: true };
  } catch {
    return { ok: false, message: '네트워크 오류가 발생했어요' };
  }
};
