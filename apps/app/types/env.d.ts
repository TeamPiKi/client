declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_WEB_URL: string;
    EXPO_PUBLIC_API_URL: string;
    EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY: string;
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
    /** 배포 환경: production | staging | dev */
    EXPO_PUBLIC_STAGE: string;
    EXPO_PUBLIC_SENTRY_DSN: string;
  }
}
