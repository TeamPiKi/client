import {
  type ShareInstagramStoryPayloadT,
  type ShareInstagramStoryStatusT,
  WEBBRIDGE_MESSAGE_TYPE,
} from '@piki/core';
import { setImageAsync } from 'expo-clipboard';
import { Directory, File, Paths } from 'expo-file-system';
/** content:// URI 변환은 아직 legacy 엔트리에만 있다 (루트 export 는 런타임에 throw) */
import { getContentUriAsync } from 'expo-file-system/legacy';
import { startActivityAsync } from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

import { WebBridge } from '@/utils/webBridge';

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

/** iOS — 인스타그램이 pasteboard 에서 이미지를 읽어가므로 딥링크보다 먼저 복사해야 한다 */
const shareToStoryOnIos = async (base64: string): Promise<ShareInstagramStoryStatusT> => {
  const canOpen = await Linking.canOpenURL(INSTAGRAM_STORIES_SCHEME);
  if (!canOpen) return 'notInstalled';

  await setImageAsync(base64);
  await Linking.openURL(INSTAGRAM_STORIES_SCHEME);

  return 'success';
};

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
