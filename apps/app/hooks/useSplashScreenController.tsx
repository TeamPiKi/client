import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useRef } from 'react';

const SPLASH_TIMEOUT_MS = 15_000;

type SplashScreenControllerContextT = {
  onWebViewLoadEnd: () => void;
  onWebViewLoadError: () => void;
};

const SplashScreenControllerContext = createContext<SplashScreenControllerContextT | null>(null);

type Props = {
  children: ReactNode;
};

/** WebView 첫 로드 완료(또는 실패·타임아웃)까지 네이티브 스플래시 유지 */
export function SplashScreenControllerProvider({ children }: Props) {
  const isHiddenRef = useRef(false);

  const hideSplash = useCallback(async () => {
    if (isHiddenRef.current) return;

    isHiddenRef.current = true;
    await SplashScreen.hideAsync();
  }, []);

  const onWebViewLoadEnd = useCallback(() => {
    void hideSplash();
  }, [hideSplash]);

  const onWebViewLoadError = useCallback(() => {
    void hideSplash();
  }, [hideSplash]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void hideSplash();
    }, SPLASH_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [hideSplash]);

  return (
    <SplashScreenControllerContext.Provider value={{ onWebViewLoadEnd, onWebViewLoadError }}>
      {children}
    </SplashScreenControllerContext.Provider>
  );
}

export const useSplashScreenController = () => {
  const context = useContext(SplashScreenControllerContext);

  if (!context) {
    throw new Error('useSplashScreenController must be used within SplashScreenControllerProvider');
  }

  return context;
};
