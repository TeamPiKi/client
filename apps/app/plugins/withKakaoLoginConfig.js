const { withAppDelegate, withInfoPlist } = require('@expo/config-plugins');

/**
 * @react-native-kakao/core 플러그인이 자동으로 추가하지 않는 iOS 설정을 보완:
 * 1. CFBundleURLTypes에 kakao{nativeAppKey} URL 스킴 추가 (카카오톡 인증 후 앱으로 복귀)
 * 2. AppDelegate.swift에 KakaoSDKAuth URL 핸들러 추가 (OAuth 코드 처리)
 */
const withKakaoLoginConfig = (config, { nativeAppKey }) => {
  const kakaoScheme = `kakao${nativeAppKey}`;

  config = withInfoPlist(config, config => {
    if (!config.modResults.CFBundleURLTypes) {
      config.modResults.CFBundleURLTypes = [];
    }

    const hasScheme = config.modResults.CFBundleURLTypes.some(entry =>
      entry.CFBundleURLSchemes?.includes(kakaoScheme)
    );

    if (!hasScheme) {
      config.modResults.CFBundleURLTypes.push({ CFBundleURLSchemes: [kakaoScheme] });
    }

    return config;
  });

  config = withAppDelegate(config, config => {
    let contents = config.modResults.contents;

    if (!contents.includes('import KakaoSDKAuth')) {
      const next = contents.replace('import Expo', 'import Expo\nimport KakaoSDKAuth\nimport KakaoSDKCommon');
      if (next === contents) {
        throw new Error('[withKakaoLoginConfig] AppDelegate.swift에서 "import Expo"를 찾을 수 없어 KakaoSDKAuth import 추가에 실패했습니다.');
      }
      contents = next;
    }

    if (!contents.includes('AuthApi.isKakaoTalkLoginUrl')) {
      /**
       * NOTE: UIScene 생명주기(SDK 58)에서는 SceneDelegate 가 받은 URL 을 Expo 가 이 메서드로 넘긴다.
       * React Native 알림은 Expo 가 따로 하므로 RCTLinkingManager 를 다시 부르지 않는다.
       * 콜드 스타트 링크는 JS 의 카카오 SDK 초기화 전에 들어올 수 있음.
       * isKakaoTalkLoginUrl 이 초기화 전 호출 시 앱을 종료시키므로 초기화 여부를 먼저 확인한다.
       */
      const ANCHOR = '  var reactNativeFactory: RCTReactNativeFactory?\n';
      const OPEN_URL_HANDLER = [
        '',
        '  public override func application(',
        '    _ app: UIApplication,',
        '    open url: URL,',
        '    options: [UIApplication.OpenURLOptionsKey: Any] = [:]',
        '  ) -> Bool {',
        '    if url.scheme?.hasPrefix("kakao") == true,',
        '      (try? KakaoSDK.shared.appKey()) != nil,',
        '      AuthApi.isKakaoTalkLoginUrl(url) {',
        '      return AuthController.handleOpenUrl(url: url)',
        '    }',
        '    return super.application(app, open: url, options: options)',
        '  }',
        '',
      ].join('\n');
      const next = contents.replace(ANCHOR, ANCHOR + OPEN_URL_HANDLER);
      if (next === contents) {
        throw new Error('[withKakaoLoginConfig] AppDelegate.swift에서 reactNativeFactory 선언을 찾을 수 없어 KakaoSDKAuth URL 핸들러 추가에 실패했습니다.');
      }
      contents = next;
    }

    config.modResults.contents = contents;
    return config;
  });

  return config;
};

module.exports = withKakaoLoginConfig;
