import type { ShareInstagramStoryStatusT } from '@piki/core';
import Constants from 'expo-constants';
import { requireOptionalNativeModule } from 'expo-modules-core';

const PLUGIN_PATH = './plugins/withInstagramStoryShare.js';

/**
 * app.json 에 등록한 withInstagramStoryShare 플러그인의 facebookAppId 를 읽는다.
 * Info.plist 와 딥링크가 같은 값을 써야 해서 단일 출처로 둔다.
 */
export const getFacebookAppId = (): string => {
  const plugins = Constants.expoConfig?.plugins ?? [];

  const entry = plugins.find(
    (plugin): plugin is [string, { facebookAppId?: string }] =>
      Array.isArray(plugin) && plugin[0] === PLUGIN_PATH
  );

  return entry?.[1]?.facebookAppId ?? '';
};

type InstagramStoryModuleT = {
  shareBackgroundImage: (
    base64: string,
    facebookAppId: string
  ) => Promise<ShareInstagramStoryStatusT>;
};

/** iOS 전용 모듈 — 안드로이드/미포함 빌드에서는 null */
const InstagramStoryModule = requireOptionalNativeModule<InstagramStoryModuleT>('InstagramStory');

export const isInstagramStoryModuleAvailable = InstagramStoryModule !== null;

/**
 * 인스타그램 스토리 편집 화면으로 배경 이미지를 전달한다 (iOS).
 * 모듈이 없거나 App ID 가 비어 있으면 'error' 를 돌려준다.
 */
export const shareInstagramStoryBackground = async (
  base64: string,
  facebookAppId: string
): Promise<ShareInstagramStoryStatusT> => {
  if (!InstagramStoryModule || !facebookAppId) return 'error';

  return InstagramStoryModule.shareBackgroundImage(base64, facebookAppId);
};
