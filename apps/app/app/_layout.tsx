import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import PushNotificationProvider from '@/components/PushNotificationProvider';
import { SplashScreenControllerProvider } from '@/hooks/useSplashScreenController';

/** Sentry 초기화는 진입점 index.js(initSentry)에서 수행 — 여기선 wrap 만 적용 */

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '');

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
});

void SplashScreen.preventAutoHideAsync();

function RootLayout() {
  return (
    <SplashScreenControllerProvider>
      <PushNotificationProvider />
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </SplashScreenControllerProvider>
  );
}

export default Sentry.wrap(RootLayout);
