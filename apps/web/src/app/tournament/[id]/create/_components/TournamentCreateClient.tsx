'use client';

import { useState } from 'react';

import { Dialog } from '@/components/dialog';
import GetItemDialogContent from '@/components/get-item-dialog';
import { QUERY_ACTION } from '@/consts/queryAction';
import { useGetMe } from '@/hooks/useGetMe';
import { useQueryAction } from '@/hooks/useQueryAction';
import { useSSEFallback } from '@/hooks/useSSEFallback';
import { hasParsingItems } from '@/utils/item';

import { type JoinConfirmPayloadT, consumeJoinConfirmFor } from '../../../join/_utils/joinSession';
import { useGetTournament } from '../../_common/_hooks/useGetTournament';
import { useCountdown } from '../_hooks/useCountdown';
import { usePostTournamentStart } from '../_hooks/usePostTournamentStart';
import { useScrollToLast } from '../_hooks/useScrollToLast';
import { hasSentInvite } from '../_utils/inviteSentSession';
import DepositClosedDialog from './deposit-closed-dialog/DepositClosedDialog';
import MemberJoinConfirmDialog from './member-join-confirm-dialog/MemberJoinConfirmDialog';
import OwnerStartedDialog from './owner-started-dialog/OwnerStartedDialog';
import ParticipantPanel from './participant-panel/ParticipantPanel';
import TournamentHeader from './tournament-header/TournamentHeader';
import TournamentItemBasketStatus from './tournament-item-basket-status/TournamentItemBasketStatus';
import TournamentItemBasketCarousel from './tournament-item-basket/TournamentItemBasketCarousel';
import TournamentStartButton from './tournament-start-button/TournamentStartButton';
import WelcomeJoinDialog from './welcome-join-dialog/WelcomeJoinDialog';

type TournamentCreateClientProps = {
  tournamentId: number;
};

function TournamentCreateClient({ tournamentId }: TournamentCreateClientProps) {
  const { scrollToLast, onScrolled } = useScrollToLast();
  const { tournamentData } = useGetTournament(tournamentId);
  const { userData } = useGetMe();

  // 주최자(ROOT)는 시작/완료 시점에 mutation/페이지에서 직접 라우팅한다.
  // 참여자(CLONE 생성 예정)는 ROOT status 변화에 따라 자동 라우팅하지 않고,
  // 본인이 "시작" 버튼을 눌러 CLONE 을 만들고 그 ID 로 매치 화면 진입한다.
  // → status 기반 자동 라우팅이 필요 없다.

  // create 화면은 pending payload 가 있는 상태(PENDING / IN_PROGRESS-MemberWaiting) 만 다룬다.
  // 그 외 상태는 RSC/match·result 페이지에서 라우팅되므로 여기서는 빈 값으로 안전 처리.
  const pending = 'pending' in tournamentData ? tournamentData.pending : null;

  // 아이템 파싱 중이면 SSE 로 실시간 업데이트 (연결 실패 시 polling fallback).
  const hasPendingItem = hasParsingItems(pending?.items ?? []);
  useSSEFallback(['tournament', tournamentId], hasPendingItem);

  // 주최자가 ROOT 를 시작한 후(ownerStarted=true) 에는 초대 기간이 이미 종료된 상태라
  // inviteExpiresAt 이 null 이고 담기 마감 카운트다운도 의미 없다.
  const ownerStarted = pending?.ownerStarted ?? false;
  const depositDeadline = pending?.inviteExpiresAt ?? '';
  const { isExpired } = useCountdown(depositDeadline);
  const participants = (pending?.participants ?? []).map(p => ({
    user: {
      id: p.userId,
      name: p.nickname,
      imageUrl: p.profileImage,
    },
    itemCount: p.itemCount,
  }));
  const hasFriends = participants.length > 1;
  // 협업 의도가 표명된 토너먼트만 담기 마감 정책을 적용한다.
  // - 친구가 합류했거나 (디바이스 변경에 무관)
  // - "초대 링크 보내기" 를 한 번이라도 눌렀거나 (혼자라도 초대 의도 있음, localStorage)
  // 어느 쪽도 아니면 혼자 천천히 담는 시나리오라 타이머/마감 모달이 의미 없다.
  const isCollaborative = hasFriends || hasSentInvite(tournamentId);
  // 담기 마감 = 초대 코드 만료 시점 (둘은 동일 정책으로 운영).
  // 단, 주최자는 만료 영향 없이 본인 토너먼트에 후보를 담을 수 있다.
  // ownerStarted 면 어차피 시작 흐름으로 넘어가야 하므로 마감 처리하지 않는다.
  // 협업 의도가 없는 토너먼트는 만료 자체를 무시한다.
  const isDepositClosed =
    !tournamentData.isOwner && !ownerStarted && isExpired && isCollaborative;

  const participantImageMap = new Map(
    (pending?.participants ?? []).map(p => [p.userId, p.profileImage])
  );

  const [confirmPayload, setConfirmPayload] = useState<JoinConfirmPayloadT | null>(() =>
    consumeJoinConfirmFor(tournamentId)
  );
  const isParticipant = !tournamentData.isOwner;
  // 참여자는 주최자가 ROOT 를 시작한 후(ownerStarted=true) 부터 본인 CLONE 시작 가능.
  const isWaitingForOwnerStart = isParticipant && pending?.ownerStarted === false;

  const { isActive: isGetItemDialogOpen, setIsActive: setIsGetItemDialogOpen } = useQueryAction({
    action: QUERY_ACTION.VALUE.OPEN_GET_ITEM_DIALOG,
  });
  const { isActive: isWelcomeOpen, setIsActive: setIsWelcomeOpen } = useQueryAction({
    action: QUERY_ACTION.VALUE.WELCOME_JOIN,
  });

  // 담기 마감 직후 주최자에게 노출되는 자동 안내 모달.
  // 만료 시점에 자동 오픈, 사용자가 닫으면 다시 띄우지 않는다.
  // 협업 의도가 없는 토너먼트(혼자 + 초대 미발송)는 띄우지 않는다.
  const [isDepositClosedDialogOpen, setIsDepositClosedDialogOpen] = useState(false);
  const [hasDismissedDepositClosed, setHasDismissedDepositClosed] = useState(false);
  const shouldShowDepositClosedDialog =
    tournamentData.isOwner &&
    !ownerStarted &&
    isExpired &&
    isCollaborative &&
    !hasDismissedDepositClosed;
  if (shouldShowDepositClosedDialog && !isDepositClosedDialogOpen) {
    setIsDepositClosedDialogOpen(true);
  }
  const { postTournamentStartMutation, isPostTournamentStartPending } =
    usePostTournamentStart(tournamentId);
  const itemCount = pending?.items.length ?? 0;

  const handleStartFromDepositClosed = () => {
    if (isPostTournamentStartPending) return;
    setIsDepositClosedDialogOpen(false);
    setHasDismissedDepositClosed(true);
    postTournamentStartMutation();
  };

  const handleDepositClosedOpenChange = (open: boolean) => {
    setIsDepositClosedDialogOpen(open);
    if (!open) setHasDismissedDepositClosed(true);
  };

  // 참여자에게 노출되는 "주최자가 토너먼트를 시작했어요!" 모달.
  // SSE(TOURNAMENT_STARTED) 또는 폴링으로 ownerStarted 가 false→true 로 바뀌는 순간 자동 오픈.
  // 사용자가 닫거나 시작하면 다시 띄우지 않는다.
  // React 공식 권장: 이전 값을 state 로 보관해 렌더 중 비교 → effect 불필요.
  const [isOwnerStartedDialogOpen, setIsOwnerStartedDialogOpen] = useState(false);
  const [hasDismissedOwnerStarted, setHasDismissedOwnerStarted] = useState(false);
  const [prevOwnerStarted, setPrevOwnerStarted] = useState(ownerStarted);
  if (prevOwnerStarted !== ownerStarted) {
    setPrevOwnerStarted(ownerStarted);
    if (isParticipant && !prevOwnerStarted && ownerStarted && !hasDismissedOwnerStarted) {
      setIsOwnerStartedDialogOpen(true);
    }
  }

  const handleStartFromOwnerStarted = () => {
    if (isPostTournamentStartPending) return;
    setIsOwnerStartedDialogOpen(false);
    setHasDismissedOwnerStarted(true);
    postTournamentStartMutation();
  };

  const handleOwnerStartedOpenChange = (open: boolean) => {
    setIsOwnerStartedDialogOpen(open);
    if (!open) setHasDismissedOwnerStarted(true);
  };

  const handleCloseConfirm = () => setConfirmPayload(null);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-layer-basement pt-padding-top pb-8">
      <div className="px-5">
        <TournamentHeader name={tournamentData.name} hasFriends={hasFriends} />
        <div className="mt-[3.9dvh]">
          <ParticipantPanel
            participants={participants}
            inviteCode={pending?.inviteCode ?? ''}
            inviteExpiresAt={pending?.inviteExpiresAt ?? ''}
            {...(isCollaborative && !ownerStarted && !isDepositClosed && { depositDeadline })}
          />
        </div>
      </div>

      <div className="mt-[3dvh] flex min-h-0 flex-1 flex-col">
        <TournamentItemBasketCarousel
          items={pending?.items}
          scrollToLast={scrollToLast}
          onScrolled={onScrolled}
          isDepositClosed={isDepositClosed}
          participantImageMap={participantImageMap}
        />
        <TournamentItemBasketStatus
          isProcessing={hasPendingItem}
          count={pending?.items.length ?? 0}
        />
      </div>

      <div className="flex shrink-0 flex-col gap-3 px-5 pt-[max(3dvh)]">
        <TournamentStartButton
          count={pending?.items.length ?? 0}
          tournamentId={tournamentId}
          hasUnreadyItem={
            hasPendingItem || (pending?.items.some(item => item.status === 'FAILED') ?? false)
          }
          hasFriends={hasFriends}
          isWaitingForOwnerStart={isWaitingForOwnerStart}
          isDepositClosed={isDepositClosed}
          isParticipant={isParticipant}
        />
      </div>

      <Dialog open={isGetItemDialogOpen} onOpenChange={setIsGetItemDialogOpen}>
        <GetItemDialogContent type="tournament" />
      </Dialog>

      <DepositClosedDialog
        open={isDepositClosedDialogOpen}
        onOpenChange={handleDepositClosedOpenChange}
        onStart={handleStartFromDepositClosed}
        onContinue={() => handleDepositClosedOpenChange(false)}
        itemCount={itemCount}
        isPending={isPostTournamentStartPending}
      />

      <OwnerStartedDialog
        open={isOwnerStartedDialogOpen}
        onOpenChange={handleOwnerStartedOpenChange}
        onStart={handleStartFromOwnerStarted}
        itemCount={itemCount}
        isPending={isPostTournamentStartPending}
      />

      {isWelcomeOpen && (
        <WelcomeJoinDialog
          userIdentityType={userData.identityType}
          open={isWelcomeOpen}
          onOpenChange={setIsWelcomeOpen}
          nickname={userData.nickname}
          profileImage={userData.profileImage}
          tournamentName={tournamentData.name}
          itemCount={pending?.items.length ?? 0}
          participantCount={pending?.participants.length ?? 0}
          onConfirm={() => setIsWelcomeOpen(false)}
        />
      )}

      {confirmPayload && (
        <MemberJoinConfirmDialog
          open
          onOpenChange={open => {
            if (!open) handleCloseConfirm();
          }}
          nickname={confirmPayload.nickname}
          profileType={confirmPayload.profileType}
          tournamentName={confirmPayload.tournamentName}
          itemCount={confirmPayload.itemCount}
          participantCount={confirmPayload.participantCount}
          onConfirm={handleCloseConfirm}
        />
      )}
    </div>
  );
}

export default TournamentCreateClient;
