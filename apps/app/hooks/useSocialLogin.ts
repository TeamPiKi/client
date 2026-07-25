import { type SocialProviderT, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { login as kakaoLogin } from '@react-native-kakao/user';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { postSocialLogin } from '@/apis/postSocialLogin';
import { TokenStorage } from '@/utils/tokenStorage';
import { WebBridge } from '@/utils/webBridge';

export const useSocialLogin = () => {
  const handleLogin = useCallback(async (provider: SocialProviderT) => {
    try {
      // 웹에서 버튼을 숨기지만, 혹시 요청이 들어와도 iOS 전용 모듈 호출 전에 방어한다.
      if (provider === 'apple' && Platform.OS !== 'ios') {
        WebBridge.postMessage({
          type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_SOCIAL_LOGIN_ERROR,
          payload: { detail: 'Apple 로그인은 iOS에서만 지원해요.' },
        });
        return;
      }

      let accessToken: string;

      if (provider === 'kakao') {
        const result = await kakaoLogin();
        accessToken = result.accessToken;
      } else if (provider === 'google') {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signIn();
        const { accessToken: googleAccessToken } = await GoogleSignin.getTokens();
        if (!googleAccessToken) throw new Error('Google Access Token을 받지 못했습니다.');
        accessToken = googleAccessToken;
      } else {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        if (!credential.identityToken) throw new Error('Apple Identity Token을 받지 못했습니다.');
        accessToken = credential.identityToken;
      }

      const body = { accessToken };
      const { accessToken: jwtAccessToken, refreshToken } = await postSocialLogin(provider, body);

      await TokenStorage.setTokens(jwtAccessToken, refreshToken);

      /** APP_RES_SOCIAL_LOGIN_SUCCESS 전에 먼저 쿠키 주입 — WebView가 메시지 처리 전에 API 요청을 보내도 토큰이 있도록  */
      WebBridge.injectCookies({ access_token: jwtAccessToken, refresh_token: refreshToken });

      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_SOCIAL_LOGIN_SUCCESS,
        payload: { accessToken: jwtAccessToken, refreshToken },
      });
    } catch (error) {
      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_SOCIAL_LOGIN_ERROR,
        payload: { detail: error instanceof Error ? error.message : '로그인에 실패했습니다.' },
      });
    }
  }, []);

  return { handleLogin };
};
