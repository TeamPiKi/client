const { withAndroidManifest, withAndroidStyles } = require('@expo/config-plugins');

const SHARE_ACTIVITY_NAME = 'expo.modules.pikishare.ShareActivity';
const SHARE_ACTIVITY_THEME = 'Theme.PikiShareActivity';

/** 기존 expo-share-intent 가 MainActivity 에 걸던 공유 인텐트 필터를 ShareActivity 로 이관 */
const SHARE_INTENT_FILTERS = [
  {
    action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
    category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
    data: [{ $: { 'android:mimeType': 'text/*' } }, { $: { 'android:mimeType': 'image/*' } }],
  },
  {
    action: [{ $: { 'android:name': 'android.intent.action.SEND_MULTIPLE' } }],
    category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
    data: [{ $: { 'android:mimeType': 'image/*' } }],
  },
];

/**
 * ShareActivity 매니페스트 등록
 * - 투명 테마로 공유 출처 앱 위에 오버레이
 * - taskAffinity="" + excludeFromRecents: 공유 출처 앱 태스크 위에 뜨되 최근 앱 목록에 남지 않음
 * - screenOrientation 미지정: API 26 은 투명 Activity 에 고정 방향을 걸면 크래시
 */
const withShareActivityManifest = config =>
  withAndroidManifest(config, modConfig => {
    const application = modConfig.modResults.manifest.application?.[0];
    if (!application) return modConfig;

    const activities = (application.activity ?? []).filter(
      activity => activity.$['android:name'] !== SHARE_ACTIVITY_NAME
    );

    activities.push({
      $: {
        'android:name': SHARE_ACTIVITY_NAME,
        'android:theme': `@style/${SHARE_ACTIVITY_THEME}`,
        'android:exported': 'true',
        'android:excludeFromRecents': 'true',
        'android:taskAffinity': '',
        'android:configChanges':
          'keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode',
        'android:windowSoftInputMode': 'adjustResize',
      },
      'intent-filter': SHARE_INTENT_FILTERS,
    });

    application.activity = activities;

    return modConfig;
  });

/** AppTheme 기반 투명(translucent) 테마 — 배경·상태바를 투명하게 해 출처 앱이 비쳐 보이게 함 */
const withShareActivityTheme = config =>
  withAndroidStyles(config, modConfig => {
    const styles = (modConfig.modResults.resources.style ?? []).filter(
      style => style.$.name !== SHARE_ACTIVITY_THEME
    );

    styles.push({
      $: { name: SHARE_ACTIVITY_THEME, parent: 'AppTheme' },
      item: [
        { $: { name: 'android:windowIsTranslucent' }, _: 'true' },
        { $: { name: 'android:windowBackground' }, _: '@android:color/transparent' },
        { $: { name: 'android:windowNoTitle' }, _: 'true' },
        { $: { name: 'android:windowAnimationStyle' }, _: '@android:style/Animation.Translucent' },
        { $: { name: 'android:backgroundDimEnabled' }, _: 'false' },
        { $: { name: 'android:colorBackgroundCacheHint' }, _: '@null' },
        { $: { name: 'android:statusBarColor' }, _: '@android:color/transparent' },
      ],
    });

    modConfig.modResults.resources.style = styles;

    return modConfig;
  });

const withAndroidShareActivity = config =>
  withShareActivityTheme(withShareActivityManifest(config));

module.exports = withAndroidShareActivity;
