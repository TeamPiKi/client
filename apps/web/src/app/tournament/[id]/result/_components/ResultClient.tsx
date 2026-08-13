'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronForwardIconFill, DownloadIconFill, UploadIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Header } from '@/components/header';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';

import { useGetTournament } from '../../_common/_hooks/useGetTournament';
import ReceiptDrawMachine from './ReceiptDrawMachine';
import ResultGuestBanner from './ResultGuestBanner';
import GroupResultEntryCard from './group-result-entry-card/GroupResultEntryCard';
import PlateShareDialog from './plate-share-dialog/PlateShareDialog';
import ReceiptShareDialog from './receipt-share-dialog/ReceiptShareDialog';

type ResultClientProps = {
  tournamentId: number;
  isGuest?: boolean;
  /** 서버가 UA 로 판정한 앱 여부 — hydration 전에도 앱 전용 UI 를 그리기 위해 받는다 */
  isApp?: boolean;
};

function ResultClient({ tournamentId, isGuest = false, isApp = false }: ResultClientProps) {
  const router = useRouter();
  const { tournamentData } = useGetTournament(tournamentId);
  const [date] = useState(() => new Date());
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReceiptShareDialogOpen, setIsReceiptShareDialogOpen] = useState(false);

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
  // 그룹 결과는 원본(ROOT) 단위로 집계된다. CLONE 에서 보고 있으면 원본 id 로 조회해야 한다.
  const groupResultTournamentId = tournamentData.sourceTournamentId ?? tournamentId;

  const handleSharePlayLink = () => {
    setIsShareDialogOpen(true);
  };

  /** 비회원 솔로는 배너가 스크롤 마지막이라 하단 여백을 줄인다 */
  const mainPb = isGuest && !tournamentData.isRoot ? 'pb-[145px]' : 'pb-40';

  return (
    <main
      className={cn(
        'flex min-h-dvh flex-col overflow-x-hidden bg-bg-layer-basement pt-padding-top',
        mainPb
      )}
    >
      <Header center="토너먼트 결과" centerClassName="heading-1-bold" />

      <div className="mx-auto mt-4 flex min-h-0 w-full max-w-120 flex-1 flex-col gap-3">
        <ReceiptDrawMachine
          tournamentId={tournamentId}
          tournamentName={tournamentName}
          result={result}
          date={date}
        />

        {isGuest && (
          <div className="mx-5 mt-[49px]">
            <ResultGuestBanner />
          </div>
        )}

        {/*
          전체 결과 보기 — 주최자·참여자·게스트 모두에게 노출한다.
          hasGroupResult 가 false 면(완료한 CLONE 없음) 눌러도 서버가 409 를 주므로 숨긴다.
        */}
        {tournamentData.completed.hasGroupResult && (
          <div className="mx-5">
            <GroupResultEntryCard tournamentId={groupResultTournamentId} />
          </div>
        )}
      </div>

      <BottomCta hasGradient className="flex-col items-stretch gap-6.5 pb-[30px]">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            icon="leading"
            leadingIcon={<DownloadIconFill aria-hidden className="size-5" />}
            onClick={() => setIsReceiptShareDialogOpen(true)}
            className="flex-1 border-gray-75 bg-gray-75 text-text-neutral-secondary"
          >
            영수증 저장
          </Button>
          {canSharePlayLink && (
            <Button
              variant="primary"
              size="lg"
              icon="leading"
              leadingIcon={<UploadIconFill aria-hidden className="size-5" />}
              onClick={handleSharePlayLink}
              className="flex-1"
            >
              토너먼트 공유
            </Button>
          )}
        </div>

        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center gap-0.5 body-1-medium text-text-neutral-secondary"
        >
          홈으로 가기
          <ChevronForwardIconFill aria-hidden className="size-4" />
        </Link>
      </BottomCta>

      <PlateShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        tournamentId={tournamentId}
        initialPlayLinkExpiresAt={tournamentData.completed.playLinkExpiresAt}
      />

      <ReceiptShareDialog
        open={isReceiptShareDialogOpen}
        onOpenChange={setIsReceiptShareDialogOpen}
        tournamentId={tournamentId}
        tournamentName={tournamentName}
        result={result}
        date={date}
        isApp={isApp}
      />
    </main>
  );
}

export default ResultClient;
