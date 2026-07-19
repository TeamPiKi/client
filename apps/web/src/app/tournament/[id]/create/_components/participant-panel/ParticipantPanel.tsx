'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { AddIconOutline, ChevronDownIconOutline, ChevronUpIconOutline } from '@/assets/icons';
import UserProfileGroup from '@/components/user-profile-group';
import type { UserT } from '@/components/user-profile-group/userProfile.const';
import { cn } from '@/utils/cn';

import DepositCountdown from '../deposit-countdown/DepositCountdown';
import InviteFriendsDialog from '../invite-friends/InviteFriendsDialog';
import ParticipantChip from './ParticipantChip';

const buildInviteUrl = (tournamentId: string, inviteCode: string) => {
  if (typeof window === 'undefined') return `/invite/${tournamentId}?code=${inviteCode}`;
  return `${window.location.origin}/invite/${tournamentId}?code=${inviteCode}`;
};

type ParticipantT = {
  user: UserT;
  itemCount: number;
};

type ParticipantPanelProps = {
  participants: ParticipantT[];
  /** 토너먼트 초대 코드 (PENDING 상태에서만 존재) */
  inviteCode?: string;
  /** 초대 코드 만료 시각 (ISO 8601) */
  inviteExpiresAt?: string;
  /** 담기 마감 시각 — 있을 때만 타이머 노출 */
  depositDeadline?: string;
};

const PLACEHOLDER_AVATAR_COUNT = 2;

function ParticipantPanel({
  participants,
  inviteCode,
  inviteExpiresAt,
  depositDeadline,
}: ParticipantPanelProps) {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const hasFriends = participants.length > 1;
  const profileImageUrls = participants.flatMap(({ user }) =>
    user.imageUrl ? [user.imageUrl] : []
  );
  const inviteUrl = inviteCode ? buildInviteUrl(tournamentId, inviteCode) : '';

  const handleToggleExpand = () => setIsExpanded(prev => !prev);
  const handleOpenInvite = () => setIsInviteDialogOpen(true);

  return (
    <>
      {hasFriends ? (
        <div className="relative w-full">
          <div
            className={cn(
              'flex w-full flex-col bg-base-50 px-4 py-3',
              isExpanded ? 'rounded-t-xl' : 'rounded-xl'
            )}
          >
            <button
              type="button"
              onClick={handleToggleExpand}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {depositDeadline ? (
                  // 칩 스타일(배경·라운딩·패딩)은 DepositCountdown 이 소유
                  <div className="shrink-0">
                    <DepositCountdown deadline={depositDeadline} showLabel={false} />
                  </div>
                ) : (
                  <UserProfileGroup profileImageUrls={profileImageUrls} max={3} />
                )}
                <p className="truncate body-1-semibold text-text-neutral-secondary">
                  {participants.length}명이 함께 담는 중
                </p>
              </div>
              {isExpanded ? (
                <ChevronUpIconOutline className="size-6 shrink-0 text-icon-neutral-secondary" />
              ) : (
                <ChevronDownIconOutline className="size-6 shrink-0 text-icon-neutral-secondary" />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="absolute top-full z-10 w-full rounded-b-xl bg-base-50 px-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {participants.map(({ user, itemCount }) => (
                  <ParticipantChip key={user.id} user={user} itemCount={itemCount} />
                ))}
                <button
                  type="button"
                  onClick={handleOpenInvite}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-neutral-muted bg-bg-layer-default"
                  aria-label="친구 초대하기"
                >
                  <AddIconOutline className="size-4 text-icon-neutral-primary" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpenInvite}
          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-base-50 px-4 py-4"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center">
              <UserProfileGroup profileImageUrls={profileImageUrls} max={1} />
              {Array.from({ length: PLACEHOLDER_AVATAR_COUNT }).map((_, index) => (
                <span
                  key={index}
                  aria-hidden
                  className="-ml-2 inline-flex size-6.75 items-center justify-center rounded-full border-[1.6px] border-white bg-gray-50 body-2-semibold text-text-neutral-tertiary relative"
                  style={{ zIndex: index + 1 }}
                >
                  ?
                </span>
              ))}
            </div>
            <p className="truncate body-1-semibold text-text-neutral-primary">
              친구와 함께 담아보세요
            </p>
          </div>
          <AddIconOutline className="size-6 shrink-0 text-icon-neutral-secondary" />
        </button>
      )}

      <InviteFriendsDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        tournamentId={Number(tournamentId)}
        inviteUrl={inviteUrl}
        inviteExpiresAt={inviteExpiresAt}
      />
    </>
  );
}

export default ParticipantPanel;
