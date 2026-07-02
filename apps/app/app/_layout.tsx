import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { ShareIntentProvider } from 'expo-share-intent';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import PushNotificationProvider from '@/components/PushNotificationProvider';
import { SplashScreenControllerProvider } from '@/hooks/useSplashScreenController';

/** 배포 환경(production/staging/dev). Sentry 는 production/staging 에서만 수집 (dev·로컬 비활성) */
const stage = process.env.EXPO_PUBLIC_STAGE;

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: stage,
  enabled: stage === 'production' || stage === 'staging',
  /** Performance(Tracing)는 초기엔 off */
  tracesSampleRate: 0,
  /** PII 기본 마스킹 (Session Replay 는 web 만, 앱은 에러/크래시만) */
  sendDefaultPii: false,
});

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '');

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
});

void SplashScreen.preventAutoHideAsync();

function RootLayout() {
  return (
    <SplashScreenControllerProvider>
      <ShareIntentProvider
        options={{
          scheme: 'piki',
        }}
      >
        <PushNotificationProvider />
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </ShareIntentProvider>
    </SplashScreenControllerProvider>
  );
}

export default Sentry.wrap(RootLayout);
