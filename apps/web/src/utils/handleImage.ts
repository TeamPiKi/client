import type { NativeImagePayloadT } from '@piki/core';

/** 웹뷰 bridge Base64 payload → 웹 FormData 업로드용 File */
export const nativeImageToFile = (image: NativeImagePayloadT): File => {
  const binary = atob(image.base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);

  return new File([buffer], image.fileName, { type: image.mimeType });
};

/**
 * 웹 Blob → 웹뷰 bridge 전송용 Base64 본문
 * `data:image/png;base64,` prefix 는 제거하고 본문만 반환한다.
 */
export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('이미지를 Base64로 변환하지 못했습니다.'));
        return;
      }

      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(new Error('이미지를 Base64로 변환하지 못했습니다.'));

    reader.readAsDataURL(blob);
  });
