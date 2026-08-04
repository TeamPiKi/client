'use client';

import type { FC, SVGProps } from 'react';

import {
  FireIconFill,
  GroupIconFill,
  HistoryIconFill,
  SadIconFill,
  WarningIconFill,
} from '@/assets/icons';
import SadFaceImage from '@/assets/images/sad-face.svg';
import Button from '@/components/button';
import ButtonLink from '@/components/button/ButtonLink';
import { ROUTES } from '@/consts/route';
import type { TournamentErrorTypeT } from '@/types/tournament';
import { cn } from '@/utils/cn';

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
  /** `\n` 은 줄바꿈으로 렌더 */
  description: string;
  buttonText: string;
  /** null 이면 이동 없이 닫기만 — 뒤에 정상 화면이 있는 진입점에서만 쓴다 */
  buttonLink: string | null;
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
    title: '만료된 초대 링크에요.',
    description: '초대 링크의 만료 기간이 지나면 접근할 수 없어요.',
    buttonText: '홈으로 가기',
    buttonLink: ROUTES.HOME,
  },
  INVALID_CODE: {
    Icon: SadFaceImage,
    iconClassName: 'size-7.75',
    title: '코드가 유효하지 않아요',
    description: '입력한 코드와 일치하는 토너먼트가 없어요.\n코드를 다시 확인해주세요.',
    buttonText: '닫기',
    buttonLink: null,
  },
  /** 참여 요청(`POST /join`) 단계에서만 발생 — 미리보기는 인원을 검사하지 않는다 */
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
  open?: boolean;
  /** 미전달 시 딤·ESC 로 닫히지 않는 종료 다이얼로그 — CTA 로만 벗어난다 */
  onOpenChange?: (open: boolean) => void;
};

function TournamentErrorDialog({ type, open = true, onOpenChange }: TournamentErrorDialogProps) {
  const { Icon, iconClassName, title, description, buttonText, buttonLink } =
    TOURNAMENT_ERROR_CONTENT[type];

  const handleBlockClose = (event: Event) => {
    if (!onOpenChange) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center gap-5"
        onInteractOutside={handleBlockClose}
        onEscapeKeyDown={handleBlockClose}
      >
        <Icon className={cn('size-10', iconClassName)} aria-hidden />
        <div className="space-y-2 text-center">
          <DialogTitle className="heading-1-bold break-keep text-text-neutral-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="body-1-medium break-keep whitespace-pre-line text-text-neutral-tertiary">
            {description}
          </DialogDescription>
        </div>
        <DialogFooter className="w-full">
          <DialogClose asChild>
            {buttonLink ? (
              <ButtonLink size="lg" href={buttonLink}>
                {buttonText}
              </ButtonLink>
            ) : (
              <Button size="lg">{buttonText}</Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TournamentErrorDialog;
