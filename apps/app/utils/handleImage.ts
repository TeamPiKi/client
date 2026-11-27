import {
  type NativeImagePayloadT,
  type OpenImagePickerPayloadT,
  SUPPORTED_IMAGE_MIME_TYPES,
  WEBBRIDGE_MESSAGE_TYPE,
} from '@piki/core';
import type { ImagePickerAsset } from 'expo-image-picker';
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';

import { captureError } from '@/utils/captureError';
import { WebBridge } from '@/utils/webBridge';

const DEFAULT_MIME_TYPE = 'image/jpeg';
const DEFAULT_IMAGE_EXTENSION = 'jpeg';

const getFileName = (asset: ImagePickerAsset, index: number): string => {
  if (asset.fileName) return asset.fileName;

  const extension = asset.mimeType?.split('/')[1] ?? DEFAULT_IMAGE_EXTENSION;
  return `image-${index + 1}.${extension}`;
};

const isSupportedImageAsset = (asset: ImagePickerAsset) => {
  if (!asset.mimeType) return false;

  return SUPPORTED_IMAGE_MIME_TYPES.includes(asset.mimeType);
};

const uriToNativeImagePayload = async (
  asset: ImagePickerAsset,
  index: number
): Promise<NativeImagePayloadT> => {
  if (!asset.base64) throw new Error('이미지 Base64 데이터가 없습니다.');

  return {
    base64: asset.base64,
    mimeType: asset.mimeType ?? DEFAULT_MIME_TYPE,
    fileName: getFileName(asset, index),
  };
};

/** WEB_REQ_OPEN_IMAGE_PICKER 수신 시 앨범 피커 오픈 → Base64 bridge 응답 */
export const handleOpenImagePicker = async ({ requestId, maxCount }: OpenImagePickerPayloadT) => {
  try {
    /** 갤러리 접근 권한 확인 */
    const permission = await requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_IMAGE_PICKER_ERROR,
        payload: {
          requestId,
          detail: '사진 보관함 접근 권한이 필요합니다.',
        },
      });
      return;
    }

    /** 이미지 가져오기 */
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: maxCount,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || result.assets.length === 0) {
      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_IMAGE_PICKER_CANCEL,
        payload: { requestId },
      });
      return;
    }

    const selectedAssets = result.assets.slice(0, maxCount);

    /** 허용 가능한 이미지 확장자만 필터링 */
    const supportedAssets = selectedAssets.filter(isSupportedImageAsset);
    const skippedCount = selectedAssets.length - supportedAssets.length;

    if (supportedAssets.length === 0) {
      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_IMAGE_PICKER_ERROR,
        payload: {
          requestId,
          detail: '지원하지 않는 형식의 이미지입니다.',
        },
      });
      return;
    }

    const images = await Promise.all(
      supportedAssets.map((asset, index) => uriToNativeImagePayload(asset, index))
    );

    /** 이미지 전송 */
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_IMAGE_PICKER_SUCCESS,
      payload: {
        requestId,
        images,
        skippedCount,
      },
    });
  } catch (error) {
    captureError(error, { tags: { source: 'webBridge', action: 'openImagePicker' } });
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_IMAGE_PICKER_ERROR,
      payload: {
        requestId,
        detail: '이미지 선택 중 오류가 발생했습니다.',
      },
    });
  }
};
