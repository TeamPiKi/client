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
    const sync = async () => {
      let accessToken = await TokenStorage.getAccessToken();
      let refreshToken = await TokenStorage.getRefreshToken();

      /**
       * 부팅 시 한 번 갱신해 SecureStore 를 최신 rotation 토큰으로 맞춘다.
       * server proxy 의 갱신은 네이티브 SecureStore 를 못 건드려, 저장된 토큰이 죽은 채로 남아
       * 딥링크 진입 시 갱신 실패 → 로그인 튕김이 나던 문제를 방지.
       */
      if (refreshToken) {
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
            /** 죽은 토큰(SecureStore + WebView 쿠키) 정리 —  */
            await TokenStorage.clearTokens();
            await CookieManager.clearAll(Platform.OS === 'ios');
            accessToken = null;
            refreshToken = null;
          }
        } catch {
          /** 네트워크 등 일시적 실패 → 기존 토큰 유지 (로그아웃되지 않도록) */
        }
      }

      // iOS WKWebView는 WKHTTPCookieStore를 사용하므로 useWebKit: true 필요
      const useWebKit = Platform.OS === 'ios';

      if (accessToken) {
        await CookieManager.set(
          WEB_URL,
          { name: 'access_token', value: accessToken, path: '/' },
          useWebKit
        );
      }

      if (refreshToken) {
        await CookieManager.set(
          WEB_URL,
          { name: 'refresh_token', value: refreshToken, path: '/' },
          useWebKit
        );
      }

      setIsSynced(true);
    };

    sync();
  }, []);

  return { isSynced };
};
