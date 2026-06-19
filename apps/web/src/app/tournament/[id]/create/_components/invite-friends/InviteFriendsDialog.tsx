'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { CheckIconFill, StopwatchIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { parseServerLocalDateTime } from '@/utils/formatDate';
import { share } from '@/utils/share';

import { usePatchInviteExpiry } from '../../_hooks/usePatchInviteExpiry';
import { markInviteSent } from '../../_utils/inviteSentSession';
import InviteExpiresPicker from './InviteExpiresPicker';

type InviteFriendsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 마감 시각 변경 API 호출용 */
  tournamentId: number;
  inviteUrl?: string;
  /** ISO 8601 — 초대 코드 만료 시각 */
  inviteExpiresAt?: string;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatExpiresInfo = (expiresAt: string | undefined) => {
  if (!expiresAt) return null;
  const expires = parseServerLocalDateTime(expiresAt);
  if (Number.isNaN(expires.getTime())) return null;

  const now = new Date();
  const remainingMs = expires.getTime() - now.getTime();
  if (remainingMs <= 0) return { remainingLabel: '마감', absoluteLabel: '만료됨' };

  const totalMinutes = Math.floor(remainingMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const remainingLabel = (() => {
    if (totalMinutes < 60) return `${totalMinutes}분 후 마감`;
    if (minutes === 0) return `${hours}시간 후 마감`;
    return `${hours}시간 ${minutes}분 후 마감`;
  })();

  const hh = String(expires.getHours()).padStart(2, '0');
  const mm = String(expires.getMinutes()).padStart(2, '0');
  const dayPrefix = (() => {
    if (isSameDay(now, expires)) return '오늘';
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (isSameDay(tomorrow, expires)) return '내일';
    return `${expires.getMonth() + 1}월 ${expires.getDate()}일`;
  })();

  return { remainingLabel, absoluteLabel: `${dayPrefix} ${hh}:${mm}까지` };
};

function InviteFriendsDialog({
  open,
  onOpenChange,
  tournamentId,
  inviteUrl,
  inviteExpiresAt,
}: InviteFriendsDialogProps) {
  const expiresInfo = useMemo(() => formatExpiresInfo(inviteExpiresAt), [inviteExpiresAt]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { patchInviteExpiryMutation, isPatchInviteExpiryPending } =
    usePatchInviteExpiry(tournamentId);

  const handleOpenPicker = () => setIsPickerOpen(true);

  const handleConfirmExpires = (newExpiresAt: string) => {
    patchInviteExpiryMutation(
      { newExpiresAt },
      {
        onSuccess: () => {
          toast.success('초대 마감 시각이 변경되었어요.');
          setIsPickerOpen(false);
        },
        onError: () => {
          toast.error('마감 시각을 변경하지 못했어요.');
        },
      }
    );
  };

  const handleSendInviteLink = async () => {
    if (!inviteUrl) return;

    const result = await share({
      title: 'piki 토너먼트 초대',
      text: '친구와 함께 piki 토너먼트에 담아봐요!',
      url: inviteUrl,
    });

    if (result === 'shared' || result === 'copied') {
      // 협업 의도 표명 — 이 시점 이후부터 담기 마감 카운트다운/모달이 의미를 가진다.
      markInviteSent(tournamentId);
      logAnalyticsEvent(ANALYTICS_EVENT.FRIEND_INVITE_SEND, {
        tournament_id: tournamentId,
        method: result,
      });
      toast.success('링크를 성공적으로 공유했어요.');
    }
    if (result === 'failed') toast.warning('공유에 실패했어요. 다시 시도해주세요.');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <DrawerTitle className="heading-1 text-text-neutral-primary">친구 초대하기</DrawerTitle>
            <DrawerDescription className="body-1-medium text-text-neutral-tertiary">
              초대 링크를 보내 친구와 함께 담을 수 있어요.
            </DrawerDescription>
          </div>

          {expiresInfo && (
            <div className="flex w-full items-center justify-between rounded-xl border border-border-neutral-muted bg-bg-layer-default px-4 py-5">
              <div className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-3xl bg-blue-50">
                  <StopwatchIconFill className="size-6 text-text-accent" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="body-2-semibold text-text-accent">{expiresInfo.remainingLabel}</p>
                  <p className="heading-1 text-text-neutral-primary">{expiresInfo.absoluteLabel}</p>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer body-2-medium text-text-neutral-tertiary underline"
                onClick={handleOpenPicker}
              >
                변경
              </button>
            </div>
          )}

          <div className="flex w-full flex-col gap-2 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <CheckIconFill className="size-4.5 text-text-neutral-secondary" />
              <p className="body-2-medium text-text-neutral-secondary">
                최대 7명까지 초대할 수 있어요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckIconFill className="size-4.5 text-text-neutral-secondary" />
              <p className="body-2-medium text-text-neutral-secondary">
                설정한 기한이 지나면 후보를 담을 수 없어요.
              </p>
            </div>
          </div>

          <Button size="lg" variant="primary" className="w-full" onClick={handleSendInviteLink}>
            초대 링크 보내기
          </Button>
        </div>
      </DrawerContent>

      <InviteExpiresPicker
        // picker 가 열릴 때만 새 인스턴스로 마운트해 initialExpiresAt 을 다시 잡는다.
        // inviteExpiresAt 변화는 key 에 반영하지 않는다 — 드래그 중 react-query refetch 등으로
        // 새 값이 들어와도 picker 가 통째로 remount 되어 사용자가 끌던 위치가 0 으로 리셋된다.
        key={isPickerOpen ? 'picker-open' : 'picker-closed'}
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        initialExpiresAt={inviteExpiresAt}
        onConfirm={handleConfirmExpires}
        isPending={isPatchInviteExpiryPending}
      />
    </Drawer>
  );
}

export default InviteFriendsDialog;
