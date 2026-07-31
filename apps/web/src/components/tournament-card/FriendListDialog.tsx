'use client';

import { useMemo } from 'react';

import { useGetGroupResult } from '@/app/tournament/[id]/result/_hooks/useGetGroupResult';
import { ProfileCircledFilledIconOutline } from '@/assets/icons';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import Spinner from '@/components/spinner';
import UserProfile from '@/components/user-profile-group/UserProfile';
import type { ProfileTypeT, UserT } from '@/components/user-profile-group/userProfile.const';
import { useGetMe } from '@/hooks/useGetMe';

type FriendListItemT = {
  userId: string;
  nickname: string;
  profileImage?: string;
  /** 본인 여부 — true 면 우측에 "나" 배지 표시 */
  isMe?: boolean;
};

type FriendListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** group-result API 호출용. COMPLETED 토너먼트에서만 의미 있음. */
  tournamentId: number;
};

/** 닉네임 → 안정적인 profileType(blue/yellow) 매핑. 이미지가 없을 때만 사용. */
const pickProfileType = (seed: string): ProfileTypeT => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(hash) % 2 === 0 ? 'blue' : 'yellow';
};

const toUser = (friend: FriendListItemT): UserT => ({
  id: friend.userId,
  name: friend.nickname,
  profileType: pickProfileType(friend.userId || friend.nickname),
  ...(friend.profileImage ? { imageUrl: friend.profileImage } : {}),
});

function FriendListDialog({ open, onOpenChange, tournamentId }: FriendListDialogProps) {
  // 모달이 열렸을 때만 group-result fetch.
  const { groupResultData, isGroupResultPending } = useGetGroupResult(tournamentId, {
    enabled: open,
  });
  const { userData } = useGetMe();
  const myUserId = userData.id;

  // group-result 의 모든 chosenBy 를 합쳐 userId 기준 dedup.
  const friends = useMemo<FriendListItemT[]>(() => {
    if (!groupResultData) return [];
    const map = new Map<string, FriendListItemT>();
    for (const item of groupResultData.items) {
      for (const participant of item.chosenBy) {
        if (map.has(participant.userId)) continue;
        map.set(participant.userId, {
          userId: participant.userId,
          nickname: participant.nickname,
          profileImage: participant.profileImage,
          isMe: participant.userId === myUserId,
        });
      }
    }
    // 본인 먼저 노출.
    return Array.from(map.values()).sort(
      (a, b) => Number(b.isMe ?? false) - Number(a.isMe ?? false)
    );
  }, [groupResultData, myUserId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-4 p-5">
        <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
          친구 목록 보기
        </DialogTitle>
        <DialogDescription className="sr-only">
          이 토너먼트에 참여한 친구 목록입니다.
        </DialogDescription>

        <FriendListBody isPending={isGroupResultPending} friends={friends} />
      </DialogContent>
    </Dialog>
  );
}

type FriendListBodyProps = {
  isPending: boolean;
  friends: FriendListItemT[];
};

function FriendListBody({ isPending, friends }: FriendListBodyProps) {
  if (isPending) {
    return (
      <div className="flex h-50 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <p className="py-10 text-center body-1-medium text-text-neutral-tertiary">
        참여한 친구가 없어요.
      </p>
    );
  }

  // 스크롤 영역 — 약 400px 안에서 4명 정도 노출, 나머지는 내부 스크롤
  return (
    <ul className="hide-scrollbar flex max-h-100 flex-col gap-2 overflow-y-auto">
      {friends.map(friend => (
        <li key={friend.userId}>
          <FriendRow friend={friend} />
        </li>
      ))}
    </ul>
  );
}

type FriendRowProps = {
  friend: FriendListItemT;
};

function FriendRow({ friend }: FriendRowProps) {
  const user = toUser(friend);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-bg-layer-basement p-5">
      <div className="flex min-w-0 items-center gap-4">
        <UserProfile user={user} className="size-8 border-0" />
        <span className="truncate body-1-bold text-text-neutral-primary">{friend.nickname}</span>
      </div>
      {friend.isMe && (
        <span className="flex shrink-0 items-center gap-1 rounded-lg bg-black/4 px-2 py-1 body-2-semibold text-text-neutral-secondary">
          <ProfileCircledFilledIconOutline
            className="size-5 text-icon-neutral-secondary"
            aria-hidden
          />
          나
        </span>
      )}
    </div>
  );
}

export default FriendListDialog;
