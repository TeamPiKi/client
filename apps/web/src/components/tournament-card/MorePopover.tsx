'use client';

import { useRouter } from 'next/navigation';
import { type MouseEvent, useState } from 'react';

import {
  GroupIconFill,
  HeartIconFill,
  ReceiptIconFill,
  ThreeDotVerticalIconFill,
  TrashIconFill,
} from '@/assets/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { TOURNAMENT_STATUS } from '@/consts/tournament';
import type { TournamentStatusT } from '@/types/tournament';

import FriendListDialog from './FriendListDialog';
import TournamentDeleteDialog from './TournamentDeleteDialog';

type MorePopoverProps = {
  status: TournamentStatusT;
  tournamentId: number;
  /** 토너먼트 참여자 수 (본인 포함). 2명 이상일 때만 '친구 목록 보기' 메뉴를 노출. */
  participantCount?: number;
};

function MorePopover({ status, tournamentId, participantCount = 0 }: MorePopoverProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFriendListOpen, setIsFriendListOpen] = useState(false);

  /** 본인 외 친구가 1명 이상이면 (= participantCount >= 2) 친구 목록 보기 메뉴 노출. */
  const hasInvitedFriends = participantCount >= 2;

  const handleAddTournamentItem = () => {
    router.push(
      `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.OPEN_GET_ITEM_DIALOG}`
    );
  };

  const handleDeleteTournament = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleViewFriendList = () => {
    setIsFriendListOpen(true);
  };

  const handleViewTournamentResult = () => {
    router.push(ROUTES.TOURNAMENT_RESULT(tournamentId));
  };

  /** 카드 전체가 Link 라 더보기 조작이 페이지 이동으로 이어지지 않게 막는다 */
  const handleStopCardNavigation = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      {/*
        Dialog 는 이 래퍼 밖에 둔다 — 안에 두면 딤 클릭이 stopPropagation 에 막혀 닫히지 않는다.
      */}
      <div className="contents" onClick={handleStopCardNavigation}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="더보기" className="cursor-pointer">
              <ThreeDotVerticalIconFill className="size-6 text-icon-neutral-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" alignOffset={-24}>
            {status === TOURNAMENT_STATUS.PENDING && (
              <>
                <DropdownMenuItem onSelect={handleAddTournamentItem}>
                  <HeartIconFill aria-hidden />
                  위시 추가하기
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDeleteTournament}>
                  <TrashIconFill aria-hidden />
                  삭제하기
                </DropdownMenuItem>
              </>
            )}

            {status === TOURNAMENT_STATUS.IN_PROGRESS && (
              <>
                {/*
                TODO: IN_PROGRESS 참여자 API 가 추가되면 친구 목록 보기 노출.
                현재는 group-result(COMPLETED 전용) 만 사용 가능해 데이터를 못 받으므로 미노출.
              */}
                <DropdownMenuItem disabled onSelect={handleDeleteTournament}>
                  <TrashIconFill aria-hidden />
                  삭제하기
                </DropdownMenuItem>
              </>
            )}

            {status === TOURNAMENT_STATUS.COMPLETED && (
              <>
                {hasInvitedFriends && (
                  <DropdownMenuItem onSelect={handleViewFriendList}>
                    <GroupIconFill aria-hidden />
                    친구 목록 보기
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={handleViewTournamentResult}>
                  <ReceiptIconFill aria-hidden />
                  결과 확인하기
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDeleteTournament}>
                  <TrashIconFill aria-hidden />
                  삭제하기
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TournamentDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        tournamentId={tournamentId}
      />

      <FriendListDialog
        open={isFriendListOpen}
        onOpenChange={setIsFriendListOpen}
        tournamentId={tournamentId}
      />
    </>
  );
}

export default MorePopover;
