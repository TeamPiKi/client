import type { ImageCropEditorModeConfigT, ImageCropEditorModeT } from './imageCropEditor.types';

export const IMAGE_CROP_EDITOR_MODE_CONFIG: Record<
  ImageCropEditorModeT,
  ImageCropEditorModeConfigT
> = {
  /** OCR 이 글자를 읽어야 해서 크게 내보냄 */
  item: { title: '이미지 편집', cropShape: 'rect', outputMaxSize: 2048 },
  /** 90px 원형으로만 노출됨 */
  profile: {
    title: '프로필 이미지 편집',
    aspect: 1,
    cropShape: 'round',
    outputMaxSize: 1080,
  },
};
