import type { InitialProps as ShareExtensionProps } from 'expo-share-extension';
import { close, openHostApp } from 'expo-share-extension';
import { type ReactNode, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { postWishLinkFromShare } from '@/utils/postWishLinkFromShare';

export default function ShareBottomSheet(props: ShareExtensionProps) {
  return (
    <SafeAreaProvider>
      <ShareBottomSheetContent {...props} />
    </SafeAreaProvider>
  );
}

function ShareBottomSheetContent({ url, text }: ShareExtensionProps) {
  const [sheetStatus, setSheetStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const handleOpenWishlist = () => {
    /** openHostApp path 규칙: `/{path}?{query}` — `web=...`만 넘기면 `/web=...` 라우트로 해석됨 */
    openHostApp(`/?web=${encodeURIComponent('/archive/wish')}`);
  };

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

    if (!productUrl) {
      setSheetStatus('error');
      return;
    }

    let isMounted = true;

    const registerWish = async () => {
      const result = await postWishLinkFromShare(productUrl);

      if (!isMounted) return;

      if (result.ok) {
        setSheetStatus('success');
        return;
      }

      setSheetStatus('error');
    };

    void registerWish();

    return () => {
      isMounted = false;
    };
  }, [url, text]);

  if (sheetStatus === 'loading')
    return (
      <SheetContainer>
        <View style={styles.handle} />

        <Text allowFontScaling={false} style={styles.title}>
          위시템을 담고 있어요
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

  if (sheetStatus === 'error')
    return (
      <SheetContainer onDimPress={() => close()}>
        <View style={styles.handle} />

        <Text allowFontScaling={false} style={styles.title}>
          위시템을 저장하지 못했어요
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/share-bottom-sheet/basket.png')}
            style={styles.image}
          />

          <Image
            source={require('@/assets/images/share-bottom-sheet/warning.png')}
            style={styles.icon}
          />
        </View>

        <Pressable style={styles.button} onPress={() => close()}>
          <Text allowFontScaling={false} style={styles.buttonText}>
            확인
          </Text>
        </Pressable>
      </SheetContainer>
    );

  return (
    <SheetContainer onDimPress={() => close()}>
      <View style={styles.handle} />

      <Text allowFontScaling={false} style={styles.title}>
        위시템을 저장했어요
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

      <Pressable style={styles.button} onPress={handleOpenWishlist}>
        <Text allowFontScaling={false} style={styles.buttonText}>
          위시템 보러가기
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 145,
    height: 105,
    marginTop: 52,
    marginBottom: 45,
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

  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#191B1F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
