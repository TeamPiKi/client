'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { useGetExploreFriends } from '../_hooks/useGetExploreFriends';
import FriendWishGrid from './FriendWishGrid';

function FriendWishContent() {
  const { exploreFriendsData } = useGetExploreFriends();
  const searchParams = useSearchParams();
  const friendParam = searchParams.get('friend');
  const activeFriendId = exploreFriendsData.some(({ userId }) => userId === friendParam)
    ? friendParam
    : null;

  const handleChipClick = (userId: string | null) => {
    if (userId === activeFriendId) return;
    replaceUrlKeepingState(
      userId
        ? `${ROUTES.EXPLORE_FRIENDS}?friend=${encodeURIComponent(userId)}`
        : ROUTES.EXPLORE_FRIENDS
    );
  };

  const chips = [
    { userId: null, nickname: '전체' },
    ...exploreFriendsData.map(({ userId, nickname }) => ({ userId, nickname })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="친구 필터"
        className="hide-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5"
      >
        {chips.map(({ userId, nickname }) => {
          const isActive = activeFriendId === userId;

          return (
            <button
              key={userId ?? 'all'}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleChipClick(userId)}
              className={cn(
                'flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-3 body-2-semibold transition-colors',
                isActive
                  ? 'border-border-neutral-primary bg-bg-neutral-secondary text-text-neutral-inverse'
                  : 'border-gray-75 bg-bg-layer-default text-text-neutral-secondary'
              )}
            >
              {nickname}
            </button>
          );
        })}
      </div>

      <Suspense>
        <FriendWishGrid friendId={activeFriendId} />
      </Suspense>
    </div>
  );
}

export default FriendWishContent;
