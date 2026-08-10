import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';

import { QUERY_ACTION, type QueryActionValueT } from './queryAction';

type QueryActionToastT = {
  message: string;
  variant: 'error' | 'info';
};

/**
 * 동작이 "토스트 한 번"뿐인 `?action=` 목록.
 *
 * 리다이렉트로 화면을 이탈시킬 때 사유를 전달하는 용도라 도착지가 어디든 동일하게 동작한다.
 * 새 안내가 필요하면 컴포넌트를 만들지 말고 여기에 한 줄만 추가한다.
 *
 * 다이얼로그 열기·스크롤처럼 화면마다 동작이 다른 action 은 여기 두지 않고
 * 해당 컴포넌트에서 `useQueryAction` 의 `isActive` 로 처리한다.
 */
export const QUERY_ACTION_TOAST: Partial<Record<QueryActionValueT, QueryActionToastT>> = {
  [QUERY_ACTION.VALUE.MEMBER_ONLY]: {
    message: '회원만 이용할 수 있는 기능이에요.',
    variant: 'info',
  },
  [QUERY_ACTION.VALUE.TOURNAMENT_ITEM_NOT_FOUND]: {
    message: ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_NOT_FOUND_ITEM],
    variant: 'error',
  },
  [QUERY_ACTION.VALUE.TOURNAMENT_FORBIDDEN]: {
    message: ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_FORBIDDEN],
    variant: 'error',
  },
  [QUERY_ACTION.VALUE.TOURNAMENT_NOT_FOUND]: {
    message: ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_NOT_FOUND],
    variant: 'error',
  },
};
