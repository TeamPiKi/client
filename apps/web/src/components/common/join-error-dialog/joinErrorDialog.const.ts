import type { FC, SVGProps } from 'react';

import { FireIconFill, GroupIconFill, HistoryIconFill } from '@/assets/icons';
import SadFaceImage from '@/assets/images/sad-face.svg';
import { ROUTES } from '@/consts/route';

/** 소셜 토너먼트 합류 과정에서 발생할 수 있는 에러 타입 */
export type JoinErrorTypeT =
  /** 토너먼트 이미 시작한 경우 */
  | 'ALREADY_STARTED'
  /** 토너먼트 종료된 경우 */
  | 'ALREADY_ENDED'
  /** 초대 링크 만료된 경우 */
  | 'LINK_EXPIRED'
  /** 초대 코드 유효하지 않은 경우 */
  | 'INVALID_CODE'
  /** 참여 인원이 가득 찬 경우 */
  | 'PARTICIPANTS_FULL';

type JoinErrorContentT = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string | null;
};

export const JOIN_ERROR_CONTENT: Record<JoinErrorTypeT, JoinErrorContentT> = {
  ALREADY_STARTED: {
    Icon: FireIconFill,
    iconClassName: 'text-icon-accent',
    title: '이미 시작된 토너먼트예요.',
    description: '진행 중인 토너먼트에는 아이템을 추가할 수 없어요.',
    buttonText: '확인',
    buttonLink: ROUTES.HOME,
  },
  /** `TOURNAMENT-005` 진행 중/완료 분리 전까지 소비처 없음 — 완료된 토너먼트 진입 안내 예약분 */
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
    iconClassName: 'size-7.75 text-icon-accent',
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
};
