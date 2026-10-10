/**
 * 크롭 출력 포맷은 JPEG 고정 — 투명도가 필요한 용도가 없고, HEIC 원본도 여기서 정규화된다.
 * NOTE: presign 의 contentType 은 원본(file.type)이 아니라 반드시 이 출력 타입을 써야 함.
 * 어긋나면 PUT 바이트와 서명이 달라 서버가 형식/내용 불일치로 거부함
 */
const CROP_OUTPUT_MIME_TYPE = 'image/jpeg';
const CROP_OUTPUT_QUALITY = 0.9;

export type CropAreaT = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** 브라우저가 디코드 못 하는 형식(Chrome/Android WebView 의 HEIC 등)은 여기서 reject 된다 */
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'));
    image.src = src;
  });

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('CROP_EXPORT_FAILED'))),
      CROP_OUTPUT_MIME_TYPE,
      CROP_OUTPUT_QUALITY
    );
  });

type CropImageOptionsT = {
  /** 출력 한 변 상한 — 노출 크기에 맞춰 줄인다 (프로필 90px 원형, OCR 은 글자가 읽혀야 함) */
  outputMaxSize: number;
};

/**
 * 크롭 영역을 canvas 로 적용해 JPEG Blob 을 만든다
 * @param cropArea 원본 픽셀 단위 좌표
 */
export const cropImage = async (
  imageSrc: string,
  cropArea: CropAreaT,
  { outputMaxSize }: CropImageOptionsT
): Promise<Blob> => {
  const image = await loadImage(imageSrc);

  const outputScale = Math.min(1, outputMaxSize / Math.max(cropArea.width, cropArea.height));
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = Math.round(cropArea.width * outputScale);
  outputCanvas.height = Math.round(cropArea.height * outputScale);
  const outputCtx = outputCanvas.getContext('2d');
  if (!outputCtx) throw new Error('CANVAS_CONTEXT_FAILED');

  outputCtx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height
  );

  return canvasToBlob(outputCanvas);
};
