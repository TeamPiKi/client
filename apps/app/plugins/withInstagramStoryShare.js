const { withInfoPlist } = require('@expo/config-plugins');

/**
 * iOS 인스타그램 스토리 공유에 필요한 Info.plist 설정.
 *
 * 2023-01 부터 인스타그램이 스토리 공유에 Facebook App ID 를 요구한다.
 * 없으면 인스타그램이 "이 앱은 스토리 공유를 지원하지 않는다" 안내만 띄운다.
 * https://developers.facebook.com/docs/instagram-platform/sharing-to-stories/
 *
 * `instagram-stories` 스킴은 app.json 의 LSApplicationQueriesSchemes 에 이미 있다.
 */
const withInstagramStoryShare = (config, { facebookAppId } = {}) => {
  if (!facebookAppId) {
    // 값이 없으면 조용히 건너뛴다 — 빌드는 되고 스토리 공유만 동작하지 않는다.
    // (환경변수 미설정인 CI/로컬에서 빌드 자체가 깨지지 않도록)
    return config;
  }

  return withInfoPlist(config, config => {
    config.modResults.FacebookAppID = facebookAppId;

    return config;
  });
};

module.exports = withInstagramStoryShare;
