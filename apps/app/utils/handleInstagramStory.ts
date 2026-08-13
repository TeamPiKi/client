import {
  type ShareInstagramStoryPayloadT,
  type ShareInstagramStoryStatusT,
  WEBBRIDGE_MESSAGE_TYPE,
} from '@piki/core';
import { Directory, File, Paths } from 'expo-file-system';
/** content:// URI 변환은 아직 legacy 엔트리에만 있다 (루트 export 는 런타임에 throw) */
import { getContentUriAsync } from 'expo-file-system/legacy';
import { startActivityAsync } from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

import { getFacebookAppId, shareInstagramStoryBackground } from '@/modules/instagram-story/src';
import { WebBridge } from '@/utils/webBridge';

/**
 * 인스타그램이 스토리 공유 요청자를 식별하는 값 — 없으면 미지원 안내가 뜬다.
 * app.json 의 withInstagramStoryShare 플러그인 설정을 그대로 읽어 값 중복을 피한다.
 */
const FACEBOOK_APP_ID = getFacebookAppId();

/** 이 스킴이 열리면 인스타그램이 설치돼 있다는 뜻 */
const INSTAGRAM_STORIES_SCHEME = 'instagram-stories://share';
const ANDROID_ADD_TO_STORY_ACTION = 'com.instagram.share.ADD_TO_STORY';
const INSTAGRAM_ANDROID_PACKAGE = 'com.instagram.android';

const STORY_CACHE_DIRECTORY = 'instagram-story';
const STORY_FILE_NAME = 'receipt.png';

const writeStoryImageFile = (base64: string) => {
  const directory = new Directory(Paths.cache, STORY_CACHE_DIRECTORY);
  if (!directory.exists) directory.create({ intermediates: true });

  const file = new File(directory, STORY_FILE_NAME);
  if (file.exists) file.delete();

  file.create();
  file.write(base64, { encoding: 'base64' });

  return file;
};

/**
 * iOS — 전용 pasteboard 키(com.instagram.sharedSticker.*)로 넘겨야 인스타그램이 읽는다.
 * 일반 이미지 복사로는 "이 앱은 스토리 공유를 지원하지 않는다" 안내만 뜬다.
 * Facebook App ID 도 2023-01 부터 필수라 네이티브 모듈에서 함께 처리한다.
 */
const shareToStoryOnIos = async (base64: string): Promise<ShareInstagramStoryStatusT> =>
  shareInstagramStoryBackground(base64, FACEBOOK_APP_ID);

/** Android — FileProvider 로 노출한 content:// URI 여야 인스타그램이 읽을 수 있다 */
const shareToStoryOnAndroid = async (
  base64: string,
  mimeType: string
): Promise<ShareInstagramStoryStatusT> => {
  const file = writeStoryImageFile(base64);

  try {
    const contentUri = await getContentUriAsync(file.uri);

    await startActivityAsync(ANDROID_ADD_TO_STORY_ACTION, {
      data: contentUri,
      type: mimeType,
      /** FLAG_GRANT_READ_URI_PERMISSION — 인스타그램이 우리 캐시 파일을 읽을 수 있게 한다 */
      flags: 1,
      packageName: INSTAGRAM_ANDROID_PACKAGE,
    });

    return 'success';
  } catch {
    /** 미설치면 처리할 액티비티가 없어 실패하므로, 설치 여부로 원인을 가른다 */
    const isInstalled = await Linking.canOpenURL(INSTAGRAM_STORIES_SCHEME);

    /** 성공 시엔 인스타그램이 아직 읽는 중일 수 있어 실패한 경우에만 정리한다 */
    if (file.exists) file.delete();

    return isInstalled ? 'error' : 'notInstalled';
  }
};

/** WEB_REQ_SHARE_INSTAGRAM_STORY 수신 시 인스타그램 스토리 편집 화면으로 이미지 전달 */
export const handleShareInstagramStory = async ({
  requestId,
  base64,
  mimeType,
}: ShareInstagramStoryPayloadT) => {
  const respond = (status: ShareInstagramStoryStatusT) => {
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_SHARE_INSTAGRAM_STORY,
      payload: { requestId, status },
    });
  };

  try {
    const status =
      Platform.OS === 'ios'
        ? await shareToStoryOnIos(base64)
        : await shareToStoryOnAndroid(base64, mimeType);

    respond(status);
  } catch {
    respond('error');
  }
};
