import type { FC, SVGProps } from 'react';

import {
  FireIconFill,
  GroupIconFill,
  HistoryIconFill,
  SadIconFill,
  WarningIconFill,
} from '@/assets/icons';
import ButtonLink from '@/components/button/ButtonLink';
import { ROUTES } from '@/consts/route';
import type { TournamentErrorTypeT } from '@/types/tournament';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../dialog';

type TournamentErrorContentT = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

const TOURNAMENT_ERROR_CONTENT: Record<TournamentErrorTypeT, TournamentErrorContentT> = {
  NO_WISH_EXISTS: {
    Icon: SadIconFill,
    iconClassName: 'text-icon-neutral-secondary',
    title: '가져올 위시가 없어요.',
    description: '위시를 먼저 추가해주세요.',
    buttonText: '위시 추가하기',
    buttonLink: ROUTES.WISHLIST,
  },
  ALREADY_STARTED: {
    Icon: FireIconFill,
    iconClassName: 'text-icon-accent',
    title: '이미 시작된 토너먼트예요.',
    description: '진행 중인 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '확인',
    buttonLink: ROUTES.HOME,
  },
  ALREADY_ENDED: {
    Icon: HistoryIconFill,
    iconClassName: 'text-icon-neutral-secondary',
    title: '종료된 토너먼트예요.',
    description: '종료된 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  LINK_EXPIRED: {
    Icon: HistoryIconFill,
    iconClassName: 'text-icon-neutral-secondary',
    title: '종료된 토너먼트에요.',
    description: '초대 링크의 만료 기간이 지나면 접근할 수 없어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  PARTICIPANTS_FULL: {
    Icon: GroupIconFill,
    iconClassName: 'text-icon-neutral-secondary',
    title: '참여 인원이 가득 찼어요.',
    description: '토너먼트는 최대 8명까지 참여할 수 있어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  REQUEST_FAILED: {
    Icon: WarningIconFill,
    iconClassName: 'text-icon-error',
    title: '요청을 처리하지 못했어요.',
    description: '토너먼트 만료 기한을 다시 확인해주세요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
};

type TournamentErrorDialogProps = {
  type: TournamentErrorTypeT;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function TournamentErrorDialog({ type, open, onOpenChange }: TournamentErrorDialogProps) {
  const { Icon, iconClassName, title, description, buttonText, buttonLink } =
    TOURNAMENT_ERROR_CONTENT[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex flex-col items-center gap-5">
        <Icon className={`size-10 ${iconClassName}`} />
        <div className="space-y-2 text-center">
          <DialogTitle className="heading-1-bold break-keep text-text-neutral-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="body-1-medium break-keep text-text-neutral-tertiary">
            {description}
          </DialogDescription>
        </div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            <ButtonLink size="lg" href={buttonLink}>
              {buttonText}
            </ButtonLink>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TournamentErrorDialog;
