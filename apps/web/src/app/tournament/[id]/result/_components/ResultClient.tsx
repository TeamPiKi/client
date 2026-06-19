'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import ReceiptIcon from '@/assets/images/tournament/result/receipt-icon.svg';
import SmileIcon from '@/assets/images/tournament/result/smile-icon.svg';
import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useQueryAction } from '@/hooks/useQueryAction';
import { logAnalyticsEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';

import { useGetTournament } from '../../_common/_hooks/useGetTournament';
import { shareReceiptImage } from '../_utils/shareReceiptImage';
import ReceiptDrawMachine, { type ReceiptDrawMachineHandleT } from './ReceiptDrawMachine';
import GroupResultEntryCard from './group-result-entry-card/GroupResultEntryCard';
import PlateShareDialog from './plate-share-dialog/PlateShareDialog';

type ResultClientProps = {
  tournamentId: number;
};

function ResultClient({ tournamentId }: ResultClientProps) {
  const router = useRouter();
  const { tournamentData } = useGetTournament(tournamentId);
  const [date] = useState(() => new Date());
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  // 동기 락 — setState 가 비동기라 빠른 연속 클릭 시 같은 이벤트 루프에서 재진입되는 걸 막는다.
  const isCapturingRef = useRef(false);
  const receiptMachineRef = useRef<ReceiptDrawMachineHandleT | null>(null);
  // SHARE_RECEIPT 액션 진입 시 예약한 setTimeout id — 언마운트 시 정리해 stale 호출을 막는다.
  const shareTimeoutRef = useRef<number | null>(null);

  // RSC에서 status 검사를 하지만, 클라에서 status가 바뀐 경우 방어
  useEffect(() => {
    if (tournamentData.status === 'COMPLETED') return;
    router.replace(ROUTES.TOURNAMENT_MATCH(tournamentId));
  }, [tournamentData.status, router, tournamentId]);

  // 결과 화면 진입 시 GA4 result_view 이벤트 — 결과 조회율 측정용.
  // 같은 인스턴스가 다른 tournamentId 로 재사용되더라도 ID 별로 정확히 1회만 로깅한다.
  const loggedCompleteForRef = useRef<number | null>(null);
  useEffect(() => {
    if (tournamentData.status !== 'COMPLETED') return;
    if (loggedCompleteForRef.current === tournamentId) return;
    loggedCompleteForRef.current = tournamentId;
    logAnalyticsEvent(ANALYTICS_EVENT.RESULT_VIEW, { tournament_id: tournamentId });
  }, [tournamentData.status, tournamentId]);

  const handleShareReceiptImage = useCallback(async () => {
    const element = receiptMachineRef.current?.getReceiptPaperElement();
    if (!element || isCapturingRef.current) return;

    isCapturingRef.current = true;
    setIsCapturing(true);
    try {
      await shareReceiptImage(element);
      logAnalyticsEvent(ANALYTICS_EVENT.RECEIPT_SHARE, { tournament_id: tournamentId });
    } catch (error) {
      console.error('[shareReceiptImage]', error);
      toast.error('영수증 이미지를 만들지 못했어요');
    } finally {
      isCapturingRef.current = false;
      setIsCapturing(false);
    }
  }, [tournamentId]);

  // 보관함의 "결과 공유하기" 메뉴에서 진입 시 자동으로 영수증 이미지 공유 시트를 띄운다.
  // 영수증 슬라이드 애니메이션(~2초) 이 끝난 뒤 캡처해야 정상이라 약간 지연.
  useQueryAction({
    action: QUERY_ACTION.VALUE.SHARE_RECEIPT,
    onAction: () => {
      shareTimeoutRef.current = window.setTimeout(handleShareReceiptImage, 2_000);
    },
  });

  // 언마운트 시 예약된 공유 타이머 정리.
  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current !== null) {
        window.clearTimeout(shareTimeoutRef.current);
        shareTimeoutRef.current = null;
      }
    };
  }, []);

  if (tournamentData.status !== 'COMPLETED') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg-layer-basement pt-padding-top">
        <p className="body-1-medium text-text-neutral-tertiary">결과를 불러오는 중...</p>
      </main>
    );
  }

  const tournamentName = tournamentData.name;
  const result = tournamentData.completed.result;
  // 플레이 링크 공유는 ROOT 의 소유자만 가능 — CLONE 소유자(친구 초대 → CLONE 생성한 사람) 제외
  const canSharePlayLink = tournamentData.isRoot && tournamentData.isOwner;

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
  };

  const handleSharePlayLink = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-bg-layer-basement pt-padding-top pb-30">
      <Header center="토너먼트 결과" centerClassName="title-1" left={<HeaderIcon name="BACK" />} />

      <div className="mx-auto mt-3 flex min-h-0 w-full max-w-120 flex-1 flex-col gap-3">
        <ReceiptDrawMachine
          ref={receiptMachineRef}
          tournamentName={tournamentName}
          result={result}
          date={date}
        />

        {/* 영수증 밖 공유 버튼 — 이미지 공유 (모든 사용자) + 토너먼트 플레이 체험 (ROOT 소유자만) */}
        <div className={cn('mx-5 flex gap-3', !canSharePlayLink && 'justify-center')}>
          <ShareButton
            icon={<ReceiptIcon aria-hidden className="size-5" />}
            label={isCapturing ? '이미지 만드는 중...' : '영수증 이미지 공유'}
            onClick={handleShareReceiptImage}
            disabled={isCapturing}
          />
          {canSharePlayLink && (
            <ShareButton
              icon={<SmileIcon aria-hidden className="size-4.25" />}
              label="토너먼트 플레이 체험"
              onClick={handleSharePlayLink}
            />
          )}
        </div>

        {/*
          친구 토너먼트 결과보기 카드 노출 + 라우팅.
          - ROOT 사용자(주최자 / 친구 초대 멤버) 에게만 노출. 본인 id 가 그대로 group-result 대상이다.
          - CLONE 사용자(플레이 링크 게스트) 는 ROOT 토너먼트의 친구 일원이 아니라 결과 카드가 의미 없으므로 숨긴다.
          - 친구 유무는 클릭 시 group-result API 응답으로 판단한다 (캐시 의존 X).
        */}
        {tournamentData.isRoot && (
          <div className="mx-5">
            <GroupResultEntryCard tournamentId={tournamentId} />
          </div>
        )}
      </div>

      {/* 하단 버튼 — 시안상 단일 CTA */}
      <div className="fixed right-0 bottom-0 left-0 z-30 mx-auto flex w-full max-w-120 items-center bg-bg-layer-basement px-5 pt-3 pb-5">
        <Button variant="primary" size="lg" onClick={handleGoHome}>
          홈으로 가기
        </Button>
      </div>

      <PlateShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        tournamentId={tournamentId}
        initialPlayLinkExpiresAt={tournamentData.completed.playLinkExpiresAt}
      />
    </main>
  );
}

type ShareButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ShareButton({ icon, label, onClick, disabled = false }: ShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-13 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-bg-layer-default body-2-semibold text-text-neutral-primary disabled:cursor-default disabled:opacity-60"
    >
      {icon}
      {label}
    </button>
  );
}

export default ResultClient;
