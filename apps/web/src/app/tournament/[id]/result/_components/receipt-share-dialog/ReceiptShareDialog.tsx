'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import Button from '@/components/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import Skeleton from '@/components/skeleton';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { useInstagramStoryShare } from '@/hooks/useInstagramStoryShare';
import { logAnalyticsEvent } from '@/utils/analytics';
import { isWebview } from '@/utils/webBridge';

import type { RankedProductT } from '../../../_common/_types/tournament';
import { captureReceiptImage, shareReceiptImageFile } from '../../_utils/shareReceiptImage';
import ReceiptShareCaptureLayer from './ReceiptShareCaptureLayer';

type ReceiptShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
  /** 서버가 UA 로 판정한 앱 여부 — 스토리 공유 버튼 노출에 쓴다 */
  isApp?: boolean;
};

function ReceiptShareDialog({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
  result,
  date,
  isApp = false,
}: ReceiptShareDialogProps) {
  const captureLayerRef = useRef<HTMLDivElement | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  /** state 는 버튼 비활성화용, ref 는 즉시 차단용 */
  const [isSharingLink, setIsSharingLink] = useState(false);
  const isSharingLinkRef = useRef(false);
  const { shareToStory, isSharing } = useInstagramStoryShare();

  /**
   * 스토리 공유는 네이티브 전용.
   * 서버가 UA 로 판정한 값을 우선 쓴다 — 클라에서만 판정하면 hydration 후에야 정해져
   * 시트가 열린 뒤 버튼이 하나 늘며 뒤늦게 나타난다.
   * UA 가 없는 구버전 앱을 위해 클라 판정(window 객체)을 fallback 으로 둔다.
   */
  const isWebviewByClient = useSyncExternalStore(
    () => () => {},
    () => isWebview(),
    () => false
  );
  const isAppEnvironment = isApp || isWebviewByClient;

  /** 시트가 열릴 때 한 번만 캡처하고, 그 blob 을 모든 액션이 재사용한다 */
  useEffect(() => {
    if (!open) return;

    let objectUrl: string | null = null;
    let isActive = true;

    const capture = async () => {
      const element = captureLayerRef.current;
      if (!element) return;

      try {
        const blob = await captureReceiptImage(element);
        if (!isActive) return;

        objectUrl = URL.createObjectURL(blob);
        setImageBlob(blob);
        setPreviewUrl(objectUrl);
      } catch {
        if (isActive) toast.error('영수증 이미지를 만들지 못했어요');
      }
    };

    void capture();

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setImageBlob(null);
      setPreviewUrl(null);
    };
  }, [open]);

  const handleShareToStory = async () => {
    if (!imageBlob) return;

    const status = await shareToStory(imageBlob);

    /** WebBridge 가 이미 업데이트 안내를 띄웠다 */
    if (status === 'blocked') return;

    /** 연타로 인한 중복 호출 — 안내 없이 무시 */
    if (status === 'busy') return;

    if (status === 'notInstalled') {
      toast.warning('인스타그램 앱을 설치하면 스토리에 공유할 수 있어요.');
      return;
    }

    if (status === 'error') {
      toast.error('스토리 공유에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, {
      tournament_id: tournamentId,
      method: 'story',
    });
    onOpenChange(false);
  };

  const handleShareLink = async () => {
    if (!imageBlob) return;
    /** 연타 방지 — state 는 리렌더 후에야 반영돼 그 사이 클릭을 막지 못한다 */
    if (isSharingLinkRef.current) return;

    isSharingLinkRef.current = true;
    setIsSharingLink(true);

    const shareResult = await shareReceiptImageFile(imageBlob).finally(() => {
      isSharingLinkRef.current = false;
      setIsSharingLink(false);
    });

    /** 이미 열린 공유 시트에서 발생한 중복 호출 — 사용자 입장에선 정상이므로 조용히 무시한다 */
    if (shareResult === 'busy') return;
    if (shareResult === 'unsupported') {
      toast.warning('이 환경에서는 공유를 지원하지 않아요. 저장을 이용해주세요.');
      return;
    }
    if (shareResult === 'cancelled') return;

    logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, {
      tournament_id: tournamentId,
      method: 'link',
    });
    onOpenChange(false);
  };

  return (
    <>
      {/* 캡처 전용 레이어 — 시트가 열려 있을 때만 렌더 */}
      {open && (
        <ReceiptShareCaptureLayer
          ref={captureLayerRef}
          tournamentId={tournamentId}
          tournamentName={tournamentName}
          result={result}
          date={date}
        />
      )}

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="flex flex-col items-center gap-6">
            <DrawerTitle className="heading-1-bold text-text-neutral-primary">
              영수증 공유
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              영수증 이미지를 공유할 수 있어요.
            </DrawerDescription>

            <div className="aspect-1080/1920 w-full max-w-52.5">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="영수증 미리보기"
                  className="size-full rounded-xl object-contain"
                />
              ) : (
                <Skeleton className="size-full rounded-xl" />
              )}
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!imageBlob || isSharingLink}
                onClick={handleShareLink}
              >
                공유하기
              </Button>

              {isAppEnvironment && (
                <button
                  type="button"
                  disabled={!imageBlob || isSharing}
                  onClick={handleShareToStory}
                  className="cursor-pointer body-2-medium text-text-neutral-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  스토리로 바로 공유하기
                </button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ReceiptShareDialog;
