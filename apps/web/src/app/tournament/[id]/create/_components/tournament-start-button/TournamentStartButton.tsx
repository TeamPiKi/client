'use client';

import { useState } from 'react';

import Button from '@/components/button';

import { usePostTournamentStart } from '../../_hooks/usePostTournamentStart';
import { needsByeWarning } from '../../_utils/bye';
import ByeWarningDialog from './ByeWarningDialog';
import ConfirmStartDialog from './ConfirmStartDialog';

/**
 * count 가 2의 거듭제곱(2, 4, 8, 16, 32) 인지 검사.
 * 아니면 부전승이 발생하므로 사용자에게 안내 모달을 띄운다.
 */
type TournamentStartButtonProps = {
  count: number;
  tournamentId: number;
  hasUnreadyItem: boolean;
  hasFriends: boolean;
  isWaitingForOwnerStart: boolean;
  isDepositClosed?: boolean;
  isParticipant?: boolean;
};

function TournamentStartButton({
  count,
  tournamentId,
  hasUnreadyItem,
  hasFriends,
  isWaitingForOwnerStart,
  isDepositClosed = false,
  isParticipant = false,
}: TournamentStartButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isByeWarningOpen, setIsByeWarningOpen] = useState(false);
  const { postTournamentStartMutation, isPostTournamentStartPending } =
    usePostTournamentStart(tournamentId);

  const startTournament = () => postTournamentStartMutation();

  /**
   * 부전승 체크를 통과한 후의 분기:
   * - 참여자(CLONE) 는 본인만 시작하니 바로 진행.
   * - 주최자는 친구가 있으면 ConfirmStartDialog (담지 못한 친구 안내), 없으면 바로 시작.
   */
  const proceedAfterByeCheck = () => {
    if (isParticipant) {
      startTournament();
      return;
    }
    if (hasFriends) {
      setIsConfirmOpen(true);
      return;
    }
    startTournament();
  };

  const handleClick = () => {
    if (isWaitingForOwnerStart) return;
    // 후보 수가 2의 거듭제곱이 아니면 부전승 발생 — 먼저 안내 모달 노출.
    if (needsByeWarning(count)) {
      setIsByeWarningOpen(true);
      return;
    }
    proceedAfterByeCheck();
  };

  const handleByeWarningConfirm = () => {
    setIsByeWarningOpen(false);
    proceedAfterByeCheck();
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    startTournament();
  };

  // 마감(isDepositClosed) 된 참여자는 후보 수와 무관하게 시작 불가.
  // 그 외에는 후보 2개 미만 / 아직 처리중인 아이템이 있으면 비활성.
  const isDisabled = isWaitingForOwnerStart || isDepositClosed || count < 2 || hasUnreadyItem;

  if (count === 0) return null;

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        disabled={isDisabled}
        isLoading={isPostTournamentStartPending}
        onClick={handleClick}
      >
        토너먼트 시작하기
      </Button>

      <ConfirmStartDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirm}
      />

      <ByeWarningDialog
        open={isByeWarningOpen}
        onOpenChange={setIsByeWarningOpen}
        onAddMore={() => setIsByeWarningOpen(false)}
        onConfirm={handleByeWarningConfirm}
        isParticipant={isParticipant}
      />
    </>
  );
}

export default TournamentStartButton;
