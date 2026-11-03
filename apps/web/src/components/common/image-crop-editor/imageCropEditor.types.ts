export type ImageCropEditorModeT = 'item' | 'profile';

export type ImageCropEditorModeConfigT = {
  title: string;
  /** 고정 비율. 없으면 자유 비율 */
  aspect?: number;
  cropShape: 'rect' | 'round';
  /** 출력 한 변 상한 */
  outputMaxSize: number;
};

export type ImageCropEditorImageT = {
  id: string;
  /** 원본 object URL */
  src: string;
  /** NOTE: null 이면 브라우저가 디코드 못 한 이미지 — 편집 없이 원본 그대로 통과시킴 */
  size: { width: number; height: number } | null;
};

export type ImageCropResultT = {
  id: string;
  /** null 이면 편집하지 않은 이미지 */
  blob: Blob | null;
};
