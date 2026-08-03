'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronForwardIconFill, ReceiptIconOutline, TrophyIconOutline } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Header } from '@/components/header';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useQueryAction } from '@/hooks/useQueryAction';
import { logAnalyticsEvent } from '@/utils/analytics';

import { useGetTournament } from '../../_common/_hooks/useGetTournament';
import ReceiptDrawMachine from './ReceiptDrawMachine';
import GroupResultEntryCard from './group-result-entry-card/GroupResultEntryCard';
import PlateShareDialog from './plate-share-dialog/PlateShareDialog';
import ReceiptShareDialog from './receipt-share-dialog/ReceiptShareDialog';

type ResultClientProps = {
  tournamentId: number;
};

function ResultClient({ tournamentId }: ResultClientProps) {
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

  // 보관함의 "결과 공유하기" 메뉴에서 진입 시 영수증 공유 시트를 자동으로 띄운다.
  useQueryAction({
    action: QUERY_ACTION.VALUE.SHARE_RECEIPT,
    onAction: () => setIsReceiptShareDialogOpen(true),
  });

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

  const handleSharePlayLink = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-bg-layer-basement pt-padding-top pb-40">
      <Header center="토너먼트 결과" centerClassName="heading-1-bold" />

      <div className="mx-auto mt-4 flex min-h-0 w-full max-w-120 flex-1 flex-col gap-3">
        <ReceiptDrawMachine
          tournamentId={tournamentId}
          tournamentName={tournamentName}
          result={result}
          date={date}
        />

        {/*
          친구 토너먼트 결과보기 카드 노출 + 라우팅.
          - ROOT 사용자(주최자 / 친구 초대 멤버) 에게만 노출. 본인 id 가 그대로 group-result 대상이다.
          - CLONE 사용자(플레이 링크 게스트) 는 ROOT 토너먼트의 친구 일원이 아니라 결과 카드가 의미 없으므로 숨긴다.
          - 친구 유무는 클릭 시 group-result API 응답으로 판단한다 (캐시 의존 X).
          - 앱 화면이 낮게 크롭될 때도 CTA 는 항상 고정돼야 해서 스크롤 영역에 둔다.
        */}
        {tournamentData.isRoot && (
          <div className="mx-5">
            <GroupResultEntryCard tournamentId={tournamentId} />
          </div>
        )}
      </div>

      {/* 하단 CTA — 저장/공유 버튼 → 홈으로 가기 순 위계, 항상 화면 하단 고정 */}
      <BottomCta hasGradient className="flex-col items-stretch gap-6.5 pb-[30px]">
        {/* 영수증 공유 (모든 사용자) + 토너먼트 공유 (ROOT 소유자만, 플레이 링크 공유) */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            icon="leading"
            leadingIcon={<ReceiptIconOutline aria-hidden className="size-5" />}
            onClick={() => setIsReceiptShareDialogOpen(true)}
            className="flex-1 border-gray-75 bg-gray-75 text-text-neutral-secondary"
          >
            영수증 공유
          </Button>
          {canSharePlayLink && (
            <Button
              variant="primary"
              size="lg"
              icon="leading"
              leadingIcon={<TrophyIconOutline aria-hidden className="size-5" />}
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
      />
    </main>
  );
}

export default ResultClient;
