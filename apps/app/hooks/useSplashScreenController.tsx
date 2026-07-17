import * as SplashScreen from 'expo-splash-screen';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const SPLASH_TIMEOUT_MS = 15_000;

type SplashScreenControllerContextT = {
  /** 웹뷰 로드 완료까지 표시하는 RN 스플래시 오버레이(SplashOverlay) 노출 여부 */
  isSplashOverlayVisible: boolean;
  onWebViewLoadEnd: () => void;
  onWebViewLoadError: () => void;
};

const SplashScreenControllerContext = createContext<SplashScreenControllerContextT | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * 스플래시 2단계 제어:
 * 1. 네이티브(시스템) 스플래시 — 첫 렌더 직후 바로 숨긴다.
 *    Android 12+ 시스템 스플래시는 로고를 저해상도 아이콘으로 그려 모서리가 뭉개지므로
 *    노출을 최소화한다 (iOS 는 고품질이지만 동작 통일).
 * 2. RN SplashOverlay — 웹뷰 첫 로드 완료(또는 실패·타임아웃)까지 동일한 화면을
 *    고해상도로 이어서 표시한다.
 */
export function SplashScreenControllerProvider({ children }: Props) {
  const isHiddenRef = useRef(false);
  const [isSplashOverlayVisible, setIsSplashOverlayVisible] = useState(true);

  // 첫 렌더가 커밋된 뒤(=RN 오버레이가 이미 그려진 뒤) 시스템 스플래시를 내려 전환 공백을 없앤다.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      /* 이미 숨겨졌거나 네이티브 스플래시 뷰가 없는 경우 — 무시해도 안전 */
    });
  }, []);

  const hideSplashOverlay = useCallback(() => {
    if (isHiddenRef.current) return;

    isHiddenRef.current = true;
    setIsSplashOverlayVisible(false);
  }, []);

  const onWebViewLoadEnd = useCallback(() => {
    hideSplashOverlay();
  }, [hideSplashOverlay]);

  const onWebViewLoadError = useCallback(() => {
    hideSplashOverlay();
  }, [hideSplashOverlay]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hideSplashOverlay();
    }, SPLASH_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [hideSplashOverlay]);

  return (
    <SplashScreenControllerContext.Provider
      value={{ isSplashOverlayVisible, onWebViewLoadEnd, onWebViewLoadError }}
    >
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
