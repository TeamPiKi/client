const { withAndroidManifest } = require('@expo/config-plugins');

const INSTAGRAM_PACKAGE = 'com.instagram.android';

/**
 * Android 11+ 는 `<queries>` 에 선언하지 않은 패키지가 보이지 않아
 * canOpenURL 이 항상 false 가 되고 인텐트 해석도 실패한다.
 */
const withInstagramQueries = config =>
  withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;

    if (!Array.isArray(manifest.queries)) manifest.queries = [];
    if (manifest.queries.length === 0) manifest.queries.push({});

    const [queries] = manifest.queries;
    if (!Array.isArray(queries.package)) queries.package = [];

    const hasInstagram = queries.package.some(
      entry => entry.$?.['android:name'] === INSTAGRAM_PACKAGE
    );
    if (!hasInstagram) {
      queries.package.push({ $: { 'android:name': INSTAGRAM_PACKAGE } });
    }

    return config;
  });

module.exports = withInstagramQueries;
