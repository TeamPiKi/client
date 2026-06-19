'use client';

import { toast } from 'sonner';

import { CheckIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import Spinner from '@/components/spinner';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { share } from '@/utils/share';

import { usePostPlayLink } from '../../_hooks/usePostPlayLink';

type PlateShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: number;
  /** 서버 응답의 playLinkExpiresAt — 아직 생성 전이면 undefined */
  initialPlayLinkExpiresAt?: string;
};

const buildPlayLinkUrl = (tournamentId: number) => {
  if (typeof window === 'undefined') return `/play/${tournamentId}`;
  return `${window.location.origin}/play/${tournamentId}`;
};

function PlateShareDialog({
  open,
  onOpenChange,
  tournamentId,
  initialPlayLinkExpiresAt,
}: PlateShareDialogProps) {
  const { postPlayLinkMutation, isPostPlayLinkPending } = usePostPlayLink(tournamentId);

  // 이미 만들어진 플레이 링크가 있으면 mutation 건너뛰고 바로 공유한다.
  const hasExistingPlayLink = Boolean(initialPlayLinkExpiresAt);

  const handleSendPlayLink = async () => {
    if (!hasExistingPlayLink) {
      try {
        await postPlayLinkMutation();
      } catch {
        toast.warning('공유 링크를 생성하지 못했어요. 다시 시도해주세요.');
        return;
      }
    }

    const result = await share({
      title: 'piki 토너먼트 플레이',
      text: '나만의 piki 토너먼트를 친구가 플레이할 수 있어요!',
      url: buildPlayLinkUrl(tournamentId),
    });

    if (result === 'shared' || result === 'copied') {
      logAnalyticsEvent(ANALYTICS_EVENT.RESULT_SHARE_CLICK, {
        tournament_id: tournamentId,
        method: result,
      });
      toast.success('링크를 성공적으로 공유했어요.');
      onOpenChange(false);
      return;
    }
    if (result === 'failed') toast.warning('공유에 실패했어요. 다시 시도해주세요.');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <DrawerTitle className="heading-1 text-text-neutral-primary">
              토너먼트 플레이 공유
            </DrawerTitle>
            <DrawerDescription className="body-1-medium text-text-neutral-tertiary">
              링크를 받은 친구는 기한 내에 플레이할 수 있어요.
            </DrawerDescription>
          </div>

          <div className="flex w-full items-center gap-2 rounded-xl bg-gray-50 px-4 py-3.5">
            <CheckIconFill className="size-4.5 shrink-0 text-text-neutral-secondary" />
            <p className="body-2-medium text-text-neutral-secondary">
              공유 시점으로부터 14일 후 자동 마감돼요.
            </p>
          </div>

          <Button
            size="lg"
            variant="primary"
            className="w-full"
            disabled={isPostPlayLinkPending}
            onClick={handleSendPlayLink}
          >
            {isPostPlayLinkPending ? <Spinner size={20} /> : '플레이 링크 보내기'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PlateShareDialog;
