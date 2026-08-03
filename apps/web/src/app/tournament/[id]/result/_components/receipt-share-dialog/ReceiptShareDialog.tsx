'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { CopyIconFill, DownloadIconFill } from '@/assets/icons';
import KakaoIcon from '@/assets/icons/social/kakao.svg';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import Skeleton from '@/components/skeleton';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';

import type { RankedProductT } from '../../../_common/_types/tournament';
import {
  captureReceiptImage,
  copyReceiptImage,
  saveReceiptImage,
  shareReceiptImageFile,
} from '../../_utils/shareReceiptImage';
import ReceiptShareCaptureLayer from './ReceiptShareCaptureLayer';

type ReceiptShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

type ShareActionProps = {
  icon: React.ReactNode;
  label: string;
  /** 원형 배경색 클래스 — 브랜드 액션(카카오 등)은 고유 색을 쓴다 */
  iconBackgroundClassName?: string;
  disabled?: boolean;
  onClick: () => void;
};

function ShareAction({
  icon,
  label,
  iconBackgroundClassName = 'bg-gray-50',
  disabled,
  onClick,
}: ShareActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        className={cn(
          'flex size-14 items-center justify-center rounded-full',
          iconBackgroundClassName
        )}
      >
        {icon}
      </span>
      <span className="body-2-medium text-text-neutral-secondary">{label}</span>
    </button>
  );
}

function ReceiptShareDialog({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
  result,
  date,
}: ReceiptShareDialogProps) {
  const captureLayerRef = useRef<HTMLDivElement | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleSave = () => {
    if (!imageBlob) return;
    saveReceiptImage(imageBlob);
    logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, {
      tournament_id: tournamentId,
      method: 'save',
    });
    toast.success('이미지를 저장했어요.');
  };

  const handleCopy = async () => {
    if (!imageBlob) return;

    const isCopied = await copyReceiptImage(imageBlob);
    if (!isCopied) {
      toast.warning('이 브라우저에서는 복사를 지원하지 않아요. 저장을 이용해주세요.');
      return;
    }

    logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, {
      tournament_id: tournamentId,
      method: 'copy',
    });
    toast.success('이미지를 복사했어요.');
  };

  const handleShareToChat = async () => {
    if (!imageBlob) return;

    const shareResult = await shareReceiptImageFile(imageBlob);
    if (shareResult === 'unsupported') {
      toast.warning('이 환경에서는 공유를 지원하지 않아요. 저장을 이용해주세요.');
      return;
    }
    if (shareResult === 'cancelled') return;

    logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, {
      tournament_id: tournamentId,
      method: 'share',
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
              영수증 이미지를 저장하거나 공유할 수 있어요.
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

            <div className="flex w-full items-start justify-center gap-10 border-t border-gray-75 pt-5">
              <ShareAction
                icon={<DownloadIconFill className="size-6 text-text-neutral-secondary" />}
                label="이미지 저장"
                disabled={!imageBlob}
                onClick={handleSave}
              />
              <ShareAction
                icon={<CopyIconFill className="size-6 text-text-neutral-secondary" />}
                label="이미지 복사"
                disabled={!imageBlob}
                onClick={handleCopy}
              />
              <ShareAction
                icon={<KakaoIcon className="size-7" />}
                iconBackgroundClassName="bg-[#FEE500]"
                label="채팅방에 공유"
                disabled={!imageBlob}
                onClick={handleShareToChat}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ReceiptShareDialog;
