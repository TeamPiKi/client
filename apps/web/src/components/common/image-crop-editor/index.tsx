'use client';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { CheckCircledIconFill, HelpIconFill, ImageIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import { Header, HeaderIcon } from '@/components/header';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import { type CropAreaT, cropImage } from '@/utils/cropImage';

import ImageCropGuide from './ImageCropGuide';
import { IMAGE_CROP_EDITOR_MODE_CONFIG } from './imageCropEditor.const';
import './imageCropEditor.css';
import type {
  ImageCropEditorImageT,
  ImageCropEditorModeT,
  ImageCropResultT,
} from './imageCropEditor.types';

const MIN_CROP_BOX_SIZE = 48;

type ImageCropEditorProps = {
  mode: ImageCropEditorModeT;
  images: ImageCropEditorImageT[];
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
  /** NOTE: 고정 비율이면 손대지 않은 이미지도 그 비율로 잘라 내보냄. 자유 비율이면 원본 그대로(null) 둠 */
  if (hasFixedAspect) return true;

  /** NOTE: 크롭 박스를 원래대로 되돌려도 좌표가 1px 미만으로 어긋날 수 있어 1px 여유를 둠 */
  return cropArea.width < size.width - 1 || cropArea.height < size.height - 1;
};

function ImageCropEditor({
  mode,
  images,
  isPending = false,
  onCancel,
  onConfirm,
}: ImageCropEditorProps) {
  const { title, aspect, cropShape, outputMaxSize } = IMAGE_CROP_EDITOR_MODE_CONFIG[mode];
  /** -1이면 가이드 */
  const [activeIndex, setActiveIndex] = useState(mode === 'item' ? -1 : 0);
  /** 화면에 한 번이라도 띄운 이미지. 전부 띄워야 완료 가능 */
  const [viewedIds, setViewedIds] = useState<Set<string>>(
    () => new Set(mode === 'item' ? [] : images.slice(0, 1).map(image => image.id))
  );
  /** NOTE: crop 이벤트가 드래그 중 매 프레임 발생해 state 로 두면 에디터 전체가 계속 리렌더됨 */
  const cropAreasRef = useRef<Record<string, CropAreaT>>({});
  const [isCropperReady, setIsCropperReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /** NOTE: Dialog Portal 이 첫 렌더에선 자식을 안 그려 ref 가 비어 있음. 엘리먼트를 state 로 받아 붙은 뒤 effect 를 돌림 */
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  /** NOTE: 가이드 표시를 state 로 두면 드래그 시작·끝마다 에디터 전체가 리렌더돼 속성만 직접 바꿈 */
  const cropAreaElementRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex];
  const isBusy = isProcessing || isPending;
  const isAllViewed = images.every(image => viewedIds.has(image.id));

  useEffect(() => {
    if (!imageElement?.isConnected || !activeImage?.size) return;

    const imageId = activeImage.id;
    const cropAreaElement = cropAreaElementRef.current;
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
      cropstart() {
        cropAreaElement?.setAttribute('data-cropping', '');
      },
      cropend() {
        cropAreaElement?.removeAttribute('data-cropping');
      },
      crop(event) {
        const { x, y, width, height } = event.detail;
        cropAreasRef.current[imageId] = { x, y, width, height };
      },
    });

    return () => {
      cropAreaElement?.removeAttribute('data-cropping');
      cropper.destroy();
    };
  }, [imageElement, activeImage, aspect, cropShape]);

  const handleSelectImage = (index: number) => {
    /** 같은 장을 다시 누르면 Cropper effect 가 안 돌아 ready 가 영영 안 옴 */
    if (index === activeIndex) return;

    setActiveIndex(index);
    /** 새 장의 원본이 Cropper 캔버스로 바뀌기 전에 한 프레임 노출되는 걸 막음 */
    setIsCropperReady(false);

    const image = images[index];
    if (!image) return;
    setViewedIds(prev => (prev.has(image.id) ? prev : new Set(prev).add(image.id)));
  };

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

        const cropArea = cropAreasRef.current[image.id] ?? { x: 0, y: 0, ...image.size };
        if (!getIsCropApplied(cropArea, image.size, typeof aspect === 'number')) {
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

  if (images.length === 0) return null;

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
            ref={cropAreaElementRef}
            data-crop-shape={cropShape}
            className="image-crop-editor relative mt-6 min-h-0 flex-1 touch-none bg-bg-neutral-primary"
          >
            {!activeImage && <ImageCropGuide />}
            {activeImage?.size && (
              <div
                /** 숨길 땐 즉시, 보일 때만 페이드인. 숨기는 것도 페이드면 그 사이 원본이 비침 */
                className={cn(
                  'absolute inset-5',
                  isCropperReady ? 'transition-opacity duration-150' : 'opacity-0'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Next/Image 쓰면 오류 발생 */}
                <img
                  key={activeImage.src}
                  ref={setImageElement}
                  src={activeImage.src}
                  alt=""
                  className="block max-w-full"
                />
              </div>
            )}
            {activeImage && !activeImage.size && (
              <p className="absolute inset-0 flex items-center justify-center px-5 text-center body-2-medium text-white">
                이 이미지는 편집할 수 없어요.
                <br />
                원본 그대로 담겨요.
              </p>
            )}
          </div>

          <div className="mb-bottom-cta flex flex-col">
            {(mode === 'item' || images.length > 1) && (
              <ul className="flex gap-1.5 overflow-x-auto px-5 pt-3 pb-4">
                {mode === 'item' && (
                  <li className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(-1)}
                      disabled={isBusy}
                      aria-label="자르기 가이드 보기"
                      aria-current={activeIndex === -1}
                      className={cn(
                        'flex size-13.5 cursor-pointer items-center justify-center rounded-xl bg-gray-400',
                        activeIndex === -1 && 'border-2 border-border-accent'
                      )}
                    >
                      <HelpIconFill className="size-6 text-icon-neutral-inverse" />
                    </button>
                  </li>
                )}
                {images.map((image, index) => {
                  const isActive = index === activeIndex;
                  const isChecked = viewedIds.has(image.id);
                  return (
                    <li key={image.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectImage(index)}
                        disabled={isBusy}
                        aria-label={`${index + 1}번째 사진 편집${isChecked ? ', 확인함' : ''}`}
                        aria-current={isActive}
                        className={cn(
                          'relative size-13.5 cursor-pointer overflow-hidden rounded-xl bg-bg-layer-default',
                          isActive
                            ? 'border-2 border-border-accent'
                            : 'border-[1.5px] border-base-50',
                          !isActive && !isChecked && 'opacity-50'
                        )}
                      >
                        {image.size ? (
                          <BaseImage
                            src={image.src}
                            alt={`${index + 1}번째 사진`}
                            sizes="54px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center">
                            <ImageIconFill className="size-5 text-icon-neutral-secondary" />
                          </span>
                        )}
                        {isChecked && (
                          <span
                            className="absolute inset-0 flex items-center justify-center bg-black/40"
                            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
                          >
                            <CheckCircledIconFill className="size-6 text-icon-accent" />
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
              disabled={isBusy || !isAllViewed || (!!activeImage?.size && !isCropperReady)}
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
