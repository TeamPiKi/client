import type { FC, SVGProps } from 'react';

import { TrophyIconFill } from '@/assets/icons';
import { ROUTES } from '@/consts/route';

/** 아이템 담기(링크·이미지)가 막히는 경우 — 합류 경로와 문구가 달라 JoinErrorDialog 와 분리한다 */
export type AddItemErrorTypeT =
  /** 토너먼트 이미 시작한 경우 */
  'ALREADY_STARTED';

type AddItemErrorContentT = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export const ADD_ITEM_ERROR_CONTENT: Record<AddItemErrorTypeT, AddItemErrorContentT> = {
  ALREADY_STARTED: {
    Icon: TrophyIconFill,
    iconClassName: 'text-icon-neutral-secondary',
    title: '이미 시작된 토너먼트예요.',
    description: '진행 중인 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '확인',
    buttonLink: ROUTES.HOME,
  },
};
