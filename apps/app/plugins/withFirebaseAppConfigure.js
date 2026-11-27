const { withAppDelegate } = require('@expo/config-plugins');

/**
 * @react-native-firebase/app 24 플러그인은 `factory.startReactNative(` 를 기준으로 FirebaseApp.configure() 를 넣음.
 * UIScene 생명주기(SDK 58) AppDelegate 에는 이 줄이 없어 초기화가 빠지므로 didFinishLaunching 의 super 호출 앞에 넣는다.
 * TODO: @react-native-firebase 27 이상으로 올리면 제거 (upstream #9331)
 */
const CONFIGURE_CALL = 'FirebaseApp.configure()';
const ANCHOR =
  '    return super.application(application, didFinishLaunchingWithOptions: launchOptions)';

const withFirebaseAppConfigure = config =>
  withAppDelegate(config, modConfig => {
    const { contents } = modConfig.modResults;
    if (contents.includes(CONFIGURE_CALL)) return modConfig;

    const next = contents.replace(ANCHOR, `    ${CONFIGURE_CALL}\n${ANCHOR}`);
    if (next === contents) {
      throw new Error(
        '[withFirebaseAppConfigure] AppDelegate.swift 에서 didFinishLaunching 의 super 호출을 찾지 못해 FirebaseApp.configure() 추가에 실패했습니다.'
      );
    }

    modConfig.modResults.contents = next.includes('import FirebaseCore')
      ? next
      : next.replace('import Expo', 'import Expo\nimport FirebaseCore');
    return modConfig;
  });

module.exports = withFirebaseAppConfigure;
