'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import PullToRefresh from '@/components/common/pull-to-refresh';
import Spacing from '@/components/spacing';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { ROUTES } from '@/consts/route';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/utils/cn';
import { refetchFirstPage } from '@/utils/refetchFirstPage';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { exploreFriendsQueryOptions } from '../_apis/getExploreFriends';
import { useGetExploreFriends } from '../_hooks/useGetExploreFriends';
import FriendWishGrid from './FriendWishGrid';

function FriendWishContent() {
  const { exploreFriendsData } = useGetExploreFriends();
  const searchParams = useSearchParams();
  const friendParam = searchParams.get('friend');
  const activeFriendId = exploreFriendsData.some(({ userId }) => userId === friendParam)
    ? friendParam
    : null;

  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(() =>
    Promise.all([
      queryClient.refetchQueries(
        { queryKey: exploreFriendsQueryOptions.queryKey },
        { throwOnError: true }
      ),
      refetchFirstPage(queryClient, QUERY_KEYS.EXPLORE.FRIEND_WISHES(activeFriendId)),
    ])
  );

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
    <div className="flex flex-col">
      <PullToRefresh {...pullToRefresh} />
      <Spacing size={16} />
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

      <Spacing size={24} />
      <Suspense>
        <FriendWishGrid friendId={activeFriendId} />
      </Suspense>
    </div>
  );
}

export default FriendWishContent;
