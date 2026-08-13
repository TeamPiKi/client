import type { InitialProps as ShareExtensionProps } from 'expo-share-extension';
import { close, openHostApp } from 'expo-share-extension';
import { type ReactNode, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { type ShareFailureReasonT, postWishLinkFromShare } from '@/utils/postWishLinkFromShare';

/** 실패 사유별 서브 문구. 서버 카탈로그와 별개로 시안 문구를 그대로 쓴다. */
const FAILURE_DESCRIPTION: Record<ShareFailureReasonT, string> = {
  unauthenticated: '',
  sessionExpired: '로그인이 만료됐어요',
  network: '네트워크 연결을 확인해주세요',
  server: '일시적인 오류가 발생했어요',
};

/** 로그인으로 유도할 사유 — 재시도해도 결과가 같다 */
const LOGIN_REQUIRED_REASONS: ShareFailureReasonT[] = ['unauthenticated', 'sessionExpired'];

/** 재시도는 1회까지. 또 실패하면 확인 버튼만 남긴다. */
const MAX_RETRY_COUNT = 1;

type SheetStateT =
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'failure'; reason: ShareFailureReasonT; retryable: boolean };

export default function ShareBottomSheet(props: ShareExtensionProps) {
  return (
    <SafeAreaProvider>
      <ShareBottomSheetContent {...props} />
    </SafeAreaProvider>
  );
}

function ShareBottomSheetContent({ url, text }: ShareExtensionProps) {
  const [sheetState, setSheetState] = useState<SheetStateT>({ status: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  /** openHostApp path 규칙: `/{path}?{query}` — `web=...`만 넘기면 `/web=...` 라우트로 해석됨 */
  const openHostAppAt = (webPath: string) => {
    openHostApp(`/?web=${encodeURIComponent(webPath)}`);
  };

  const handleOpenWishlist = () => openHostAppAt('/archive/wish');
  const handleOpenLogin = () => openHostAppAt('/login');

  useEffect(() => {
    /**
     * NOTE: 웹은 url, 앱은 text로 링크와 상품 설명이 함께 오는 경우가 많음
     *
     * ex)
     * - 웹: {"rootTag":11,"initialProps":{"pixelRatio":3,"initialViewWidth":390,"url":"https://29cm.onelink.me/1080201211/sacus9l2","initialViewHeight":844,"fontScale":0.8823529411764706},"fabric":true}
     * - 앱: {"rootTag":11,"initialProps":{"pixelRatio":3,"initialViewWidth":390,"fontScale":0.8823529411764706,"initialViewHeight":844,"text":"[제작/빅사이즈]이블렛 케이닌 쿨링 리본 뷔스티에 미니원피스 제이스타일\nhttps://s.zigzag.kr/XWnpU1fuZx"},"fabric":true}
     */
    const urlFromText = text?.match(/https?:\/\/[^\s]+/)?.[0]?.replace(/[),.]+$/, '');
    const productUrl = url ?? urlFromText;

    /** 링크를 못 찾은 경우 — 공유된 내용이 그대로라 다시 눌러도 같다 */
    if (!productUrl) {
      setSheetState({ status: 'failure', reason: 'server', retryable: false });
      return;
    }

    let isMounted = true;

    const registerWish = async () => {
      const result = await postWishLinkFromShare(productUrl);

      if (!isMounted) return;

      setSheetState(
        result.ok
          ? { status: 'success' }
          : { status: 'failure', reason: result.reason, retryable: result.retryable }
      );
    };

    void registerWish();

    return () => {
      isMounted = false;
    };
    // retryCount 가 바뀌면 같은 링크로 다시 등록을 시도한다
  }, [url, text, retryCount]);

  const handleRetry = () => {
    setSheetState({ status: 'loading' });
    setRetryCount(count => count + 1);
  };

  if (sheetState.status === 'loading')
    return (
      <SheetContainer>
        <View style={styles.handle} />

        <Text allowFontScaling={false} style={styles.title}>
          위시를 담고 있어요
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/share-bottom-sheet/basket.png')}
            style={styles.image}
          />

          <LoadingDots />
        </View>
      </SheetContainer>
    );

  if (sheetState.status === 'failure') {
    const { reason, retryable } = sheetState;
    const isLoginRequired = LOGIN_REQUIRED_REASONS.includes(reason);
    /** 토큰 자체가 없으면 실패가 아니라 로그인 유도 화면 (세션 만료는 실패 화면 + 로그인 버튼) */
    const isLoginPrompt = reason === 'unauthenticated';
    const canRetry = retryable && retryCount < MAX_RETRY_COUNT;

    return (
      <SheetContainer onDimPress={() => close()}>
        <View style={styles.handle} />

        <View style={styles.titleGroup}>
          <Text allowFontScaling={false} style={styles.title}>
            {isLoginPrompt ? '위시를 담으려면 로그인 해주세요' : '위시를 저장하지 못했어요'}
          </Text>
          {FAILURE_DESCRIPTION[reason] ? (
            <Text allowFontScaling={false} style={styles.description}>
              {FAILURE_DESCRIPTION[reason]}
            </Text>
          ) : null}
        </View>

        {isLoginPrompt ? (
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/share-bottom-sheet/login-tag.png')}
              style={styles.loginImage}
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/share-bottom-sheet/basket.png')}
              style={styles.image}
            />

            <Image
              source={require('@/assets/images/share-bottom-sheet/icon-error.png')}
              style={styles.icon}
            />
          </View>
        )}

        {isLoginRequired || canRetry ? (
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => close()}>
              <Text allowFontScaling={false} style={styles.buttonSecondaryText}>
                {isLoginRequired ? '나중에 할게요' : '확인'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={isLoginRequired ? handleOpenLogin : handleRetry}
            >
              <Text allowFontScaling={false} style={styles.buttonText}>
                {isLoginRequired ? '로그인하기' : '다시 시도'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.button, styles.buttonFull]} onPress={() => close()}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              확인
            </Text>
          </Pressable>
        )}
      </SheetContainer>
    );
  }

  return (
    <SheetContainer onDimPress={() => close()}>
      <View style={styles.handle} />

      <Text allowFontScaling={false} style={styles.title}>
        위시를 저장 했어요
      </Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/share-bottom-sheet/basket.png')}
          style={styles.image}
        />

        <Image
          source={require('@/assets/images/share-bottom-sheet/icon-success.png')}
          style={styles.icon}
        />
      </View>

      <Pressable style={[styles.button, styles.buttonFull]} onPress={handleOpenWishlist}>
        <Text allowFontScaling={false} style={styles.buttonText}>
          위시 보러가기
        </Text>
      </Pressable>
    </SheetContainer>
  );
}

type SheetContainerProps = {
  children: ReactNode;
  onDimPress?: () => void;
};

function SheetContainer({ children, onDimPress }: SheetContainerProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.dim, { top: -top }]} onPress={onDimPress} disabled={!onDimPress} />
      <View style={[styles.sheet, { paddingBottom: bottom }]}>{children}</View>
    </View>
  );
}

const DOT_COUNT = 3;
const DOT_INTERVAL_MS = 400;

function LoadingDots() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(previousIndex => (previousIndex + 1) % DOT_COUNT);
    }, DOT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.dots}>
      {Array(DOT_COUNT)
        .fill(0)
        .map((_, dotIndex) => (
          <View
            key={dotIndex}
            style={[
              styles.dot,
              {
                backgroundColor: dotIndex === activeIndex ? '#191B1F' : '#F4F4F6',
              },
            ]}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000066',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    height: 4,
    width: 36,
    backgroundColor: '#D9D9D9',
    borderRadius: 24,
    marginBottom: 20,
  },
  titleGroup: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
    color: '#2D3037',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#686F7E',
    textAlign: 'center',
  },
  image: {
    width: 145,
    height: 105,
    marginTop: 52,
    marginBottom: 45,
  },
  /** 시안 태그 실측 117.6x142.3 — 169px 영역 안에 여백 13 을 두고 들어간다 */
  loginImage: {
    width: 118,
    height: 143,
    marginVertical: 13,
  },
  imageContainer: {
    position: 'relative',
  },
  dots: {
    position: 'absolute',
    top: 114,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F4F4F6',
  },

  /** 시안 버튼 폭 175/176 + gap 12 — 기기 폭에 맞춰 균등 분할한다 */
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    width: '100%',
    backgroundColor: '#191B1F',
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#191B1F',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#E9E9ED',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#686F7E',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },

  icon: {
    width: 48,
    height: 48,
    position: 'absolute',
    top: 93,
    left: 49,
  },
});
