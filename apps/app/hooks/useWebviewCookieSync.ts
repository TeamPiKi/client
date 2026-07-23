import { getTokenExpiresIso, isFresherToken, isTokenValid } from '@piki/core';
import CookieManager from '@react-native-cookies/cookies';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { postTokenRefresh } from '@/apis/postTokenRefresh';
import { TokenStorage } from '@/utils/tokenStorage';

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'http://localhost:3000';

/**
 * expo-secure-store의 토큰을 WebView 쿠키 저장소에 동기화
 * WebView 첫 요청 전에 쿠키가 심어져야 RSC 프리페치가 정상 동작함
 */
export const useWebviewCookieSync = () => {
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const useWebKit = Platform.OS === 'ios';

    const sync = async () => {
      let accessToken = await TokenStorage.getAccessToken();
      let refreshToken = await TokenStorage.getRefreshToken();

      /** SecureStore vs 웹뷰 쿠키 중 최신 토큰 채택 */
      const cookies = await CookieManager.get(WEB_URL, useWebKit);
      const cookieAccessToken = cookies['access_token']?.value ?? null;
      const cookieRefreshToken = cookies['refresh_token']?.value ?? null;

      if (
        cookieAccessToken &&
        cookieRefreshToken &&
        isFresherToken(cookieRefreshToken, refreshToken)
      ) {
        accessToken = cookieAccessToken;
        refreshToken = cookieRefreshToken;
        await TokenStorage.setTokens(accessToken, refreshToken);
      }

      /** access 가 아직 유효하면 refresh 생략 */
      if (refreshToken && !isTokenValid(accessToken, 60_000)) {
        try {
          const refreshResponse = await postTokenRefresh(refreshToken);

          if (refreshResponse.ok) {
            const refreshBody = (await refreshResponse.json()) as {
              data: { accessToken: string; refreshToken: string };
            };
            accessToken = refreshBody.data.accessToken;
            refreshToken = refreshBody.data.refreshToken;
            await TokenStorage.setTokens(accessToken, refreshToken);
          } else if (refreshResponse.status === 401) {
            /** 토큰 갱신 401 응답 시 만료된 토큰 정리 */
            await TokenStorage.clearTokens();
            await CookieManager.clearAll(useWebKit);
            accessToken = null;
            refreshToken = null;
          }
        } catch {
          /** 네트워크 등 일시적 실패 → 기존 토큰 유지 (로그아웃되지 않도록) */
        }
      }

      /** expires 미지정 시 세션 쿠키가 되어 앱 종료 때 증발 — 토큰 exp 를 그대로 부여 */
      if (accessToken) {
        const expires = getTokenExpiresIso(accessToken);
        await CookieManager.set(
          WEB_URL,
          {
            name: 'access_token',
            value: accessToken,
            path: '/',
            ...(expires ? { expires } : {}),
          },
          useWebKit
        );
      }

      if (refreshToken) {
        const expires = getTokenExpiresIso(refreshToken);
        await CookieManager.set(
          WEB_URL,
          {
            name: 'refresh_token',
            value: refreshToken,
            path: '/',
            ...(expires ? { expires } : {}),
          },
          useWebKit
        );
      }

      setIsSynced(true);
    };

    sync();
  }, []);

  return { isSynced };
};
