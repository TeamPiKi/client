import { FireIconFill, HistoryIconFill, InboxIconFill, WarningIconFill } from '@/assets/icons';
import Button from '@/components/button';
import ButtonLink from '@/components/button/ButtonLink';
import { ROUTES } from '@/consts/route';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../dialog';

type Props = {
  type: 'NO_WISH_EXISTS' | 'ALREADY_STARTED' | 'ALREADY_ENDED' | 'LINK_EXPIRED' | 'REQUEST_FAILED';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
};

const CONTENT = {
  NO_WISH_EXISTS: {
    icon: <InboxIconFill className="size-10 text-icon-neutral-secondary" />,
    title: '가져올 위시가 없어요.',
    description: '위시를 먼저 추가해주세요.',
    buttonText: '위시 담기',
    buttonLink: ROUTES.WISHLIST,
  },
  ALREADY_STARTED: {
    icon: <FireIconFill className="size-10 text-icon-accent" />,
    title: '이미 시작된 토너먼트예요.',
    description: '진행 중인 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '확인',
    buttonLink: ROUTES.HOME,
  },
  ALREADY_ENDED: {
    icon: <HistoryIconFill className="size-10 text-icon-neutral-secondary" />,
    title: '종료된 토너먼트예요.',
    description: '종료된 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  LINK_EXPIRED: {
    icon: <HistoryIconFill className="size-10 text-icon-neutral-secondary" />,
    title: '종료된 토너먼트에요.',
    description: '초대 링크의 유효 기간이 지나면 접근할 수 없어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  REQUEST_FAILED: {
    icon: <WarningIconFill className="size-10 text-icon-error" />,
    title: '요청을 처리하지 못했어요.',
    description: '토너먼트 세션 기한을 다시 확인해주세요',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
};

function TournamentErrorDialog({
  type,
  open,
  onOpenChange,
  secondaryButtonText,
  onSecondaryClick,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5">
        {CONTENT[type].icon}
        <div className="space-y-2 text-center">
          <DialogTitle className="heading-1-bold break-keep text-text-neutral-primary">
            {CONTENT[type].title}
          </DialogTitle>
          <DialogDescription className="body-1-medium break-keep text-text-neutral-tertiary">
            {CONTENT[type].description}
          </DialogDescription>
        </div>
        <DialogFooter className="flex w-full gap-2">
          {secondaryButtonText && (
            <Button variant="secondary" size="lg" onClick={onSecondaryClick}>
              {secondaryButtonText}
            </Button>
          )}
          <DialogClose asChild>
            <ButtonLink size="lg" href={CONTENT[type].buttonLink}>
              {CONTENT[type].buttonText}
            </ButtonLink>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TournamentErrorDialog;
