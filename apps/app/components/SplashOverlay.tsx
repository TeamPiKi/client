import { Image, StyleSheet, View } from 'react-native';

/** app.json expo-splash-screen 설정과 동일하게 유지 (backgroundColor / imageWidth) */
const SPLASH_BACKGROUND_COLOR = '#A2DEFF';
const SPLASH_LOGO_WIDTH = 200;

/**
 * 네이티브 스플래시를 이어받는 RN 스플래시 오버레이.
 *
 * Android 12+ 는 시스템 스플래시가 로고를 저해상도 아이콘으로 래스터해 확대하기 때문에
 * 모서리가 뭉개져 보인다. 시스템 스플래시는 첫 렌더 직후 바로 숨기고, 웹뷰 로드 완료까지는
 * 이 오버레이가 동일한 화면(배경색 + 로고)을 고해상도로 그린다.
 */
function SplashOverlay() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: SPLASH_BACKGROUND_COLOR,
    justifyContent: 'center',
  },
  logo: {
    height: SPLASH_LOGO_WIDTH,
    width: SPLASH_LOGO_WIDTH,
  },
});

export default SplashOverlay;
