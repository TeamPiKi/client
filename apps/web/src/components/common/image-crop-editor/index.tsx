'use client';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ImageIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Header, HeaderIcon } from '@/components/header';
import { cn } from '@/utils/cn';
import { type CropAreaT, cropImage } from '@/utils/cropImage';

import './imageCropEditor.css';
import type { ImageCropEditorImageT, ImageCropResultT } from './imageCropEditor.types';

const MIN_CROP_BOX_SIZE = 48;

type ImageCropEditorProps = {
  title: string;
  images: ImageCropEditorImageT[];
  /**
   * 고정 비율. 없으면 자유 비율
   * NOTE: 고정 비율이면 손대지 않은 이미지도 그 비율로 잘라 내보냄. 자유 비율이면 원본 그대로(null) 둠
   */
  aspect?: number;
  cropShape?: 'rect' | 'round';
  /** 출력 한 변 상한 */
  outputMaxSize: number;
  /** 확인 후 호출부의 후속 작업(업로드 등) 진행 중 */
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: (results: ImageCropResultT[]) => void;
};

const getIsCropApplied = (
  cropArea: CropAreaT,
  size: { width: number; height: number },
  hasFixedAspect: boolean
) => {
  if (hasFixedAspect) return true;

  /** NOTE: 크롭 박스를 원래대로 되돌려도 좌표가 1px 미만으로 어긋날 수 있어 1px 여유를 둠 */
  return cropArea.width < size.width - 1 || cropArea.height < size.height - 1;
};

/** 피커 선택 직후 화면 전체를 덮는 크롭 에디터. 여러 장이면 하단 썸네일로 장을 옮겨가며 편집 */
function ImageCropEditor({
  title,
  images,
  aspect,
  cropShape = 'rect',
  outputMaxSize,
  isPending = false,
  onCancel,
  onConfirm,
}: ImageCropEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cropAreas, setCropAreas] = useState<Record<string, CropAreaT>>({});
  const cropAreasRef = useRef(cropAreas);
  cropAreasRef.current = cropAreas;
  const [isCropperReady, setIsCropperReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /** NOTE: Dialog Portal 이 첫 렌더에선 자식을 안 그려 ref 가 비어 있음. 엘리먼트를 state 로 받아 붙은 뒤 effect 를 돌림 */
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  const activeImage = images[activeIndex] ?? images[0];
  const hasFixedAspect = typeof aspect === 'number';
  const isMultiple = images.length > 1;
  const isBusy = isProcessing || isPending;

  /** 장을 옮길 때마다 Cropper 를 새로 붙인다 */
  useEffect(() => {
    /** NOTE: img 가 key 로 교체되는 커밋에선 state 의 엘리먼트가 아직 이전 것이라 DOM 에서 떨어져 있음. 다음 렌더에서 새 엘리먼트로 다시 돎 */
    if (!imageElement?.isConnected || !activeImage?.size) return;

    const imageId = activeImage.id;
    setIsCropperReady(false);

    const cropper = new Cropper(imageElement, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: aspect ?? NaN,
      autoCropArea: 1,
      data: cropAreasRef.current[imageId],
      zoomable: false,
      minCropBoxWidth: MIN_CROP_BOX_SIZE,
      minCropBoxHeight: MIN_CROP_BOX_SIZE,
      background: false,
      checkOrientation: false,
      toggleDragModeOnDblclick: false,
      guides: cropShape === 'rect',
      center: false,
      highlight: false,
      ready() {
        setIsCropperReady(true);
      },
      crop(event) {
        const { x, y, width, height } = event.detail;
        setCropAreas(prev => ({ ...prev, [imageId]: { x, y, width, height } }));
      },
    });

    return () => {
      cropper.destroy();
    };
  }, [imageElement, activeImage, aspect, cropShape]);

  /** NOTE: 처리 중 취소를 막음. 에디터가 먼저 닫히면 뒤늦게 완료된 onConfirm 이 취소한 이미지를 적용해버림 */
  const handleCancel = () => {
    if (isBusy) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isBusy) return;

    setIsProcessing(true);
    try {
      const results: ImageCropResultT[] = [];
      /** NOTE: 병렬로 돌리면 원본 디코드본이 장 수만큼 동시에 잡혀 웹뷰 메모리가 터질 수 있음 */
      for (const image of images) {
        if (!image.size) {
          results.push({ id: image.id, blob: null });
          continue;
        }

        const cropArea = cropAreas[image.id] ?? { x: 0, y: 0, ...image.size };
        if (!getIsCropApplied(cropArea, image.size, hasFixedAspect)) {
          results.push({ id: image.id, blob: null });
          continue;
        }

        const blob = await cropImage(image.src, cropArea, { outputMaxSize });
        results.push({ id: image.id, blob });
      }
      onConfirm(results);
    } catch {
      toast.error('이미지 처리 중 오류가 발생했어요.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeImage) return null;

  const isActiveEditable = !!activeImage.size;
  const isConfirmDisabled = isBusy || (isActiveEditable && !isCropperReady);

  return (
    <Dialog
      open
      onOpenChange={nextOpen => {
        if (!nextOpen) handleCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        closeOnDimClick={false}
        showOverlay={false}
        onOpenAutoFocus={event => event.preventDefault()}
        onEscapeKeyDown={event => {
          if (isBusy) event.preventDefault();
        }}
        className="inset-0 w-full max-w-none translate-x-0 translate-y-0 rounded-none bg-bg-layer-basement p-0 pt-padding-top"
      >
        <div className="mx-auto flex min-h-0 w-full max-w-120 flex-1 flex-col">
          <div className="px-5">
            <Header
              left={<HeaderIcon name="BACK" className="size-7.5" onClick={handleCancel} />}
              center={
                <DialogTitle asChild>
                  <h1 className="heading-1-bold text-text-neutral-primary">{title}</h1>
                </DialogTitle>
              }
            />
          </div>

          <DialogDescription className="sr-only">
            크롭 박스 모서리를 끌어 자를 영역을 정할 수 있어요.
          </DialogDescription>

          <div
            data-crop-shape={cropShape}
            className="image-crop-editor relative mt-6 min-h-0 flex-1 touch-none bg-black"
          >
            {isActiveEditable ? (
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- Cropper.js 가 직접 붙잡는 원본 엘리먼트 */}
                <img
                  key={activeImage.src}
                  ref={setImageElement}
                  src={activeImage.src}
                  alt=""
                  className="block max-w-full"
                />
              </div>
            ) : (
              <p className="absolute inset-0 flex items-center justify-center px-5 text-center body-2-medium text-white">
                이 이미지는 편집할 수 없어요.
                <br />
                원본 그대로 담겨요.
              </p>
            )}
          </div>

          <div className="mb-bottom-cta flex flex-col">
            {isMultiple && (
              <ul className="flex gap-2 overflow-x-auto px-5 py-4">
                {images.map((image, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li key={image.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        disabled={isBusy}
                        aria-label={`${index + 1}번째 사진 편집`}
                        aria-current={isActive}
                        className={cn(
                          'relative size-14 cursor-pointer overflow-hidden rounded-lg bg-bg-layer-default',
                          isActive && 'outline-2 outline-border-accent'
                        )}
                      >
                        {image.size ? (
                          <BaseImage
                            src={image.src}
                            alt={`${index + 1}번째 사진`}
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center">
                            <ImageIconFill className="size-5 text-icon-neutral-secondary" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <BottomCta>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleConfirm}
              isLoading={isBusy}
              disabled={isConfirmDisabled}
            >
              완료
            </Button>
          </BottomCta>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageCropEditor;
