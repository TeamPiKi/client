import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { GetInvitePreviewResponseT } from '../_types/join';

/**
 * 초대 코드로 토너먼트 미리보기.
 * 홈 다이얼로그에서 6자리 코드만 입력하는 경로 전용.
 * 응답으로 받은 tournamentId 를 이후 /join 호출에 사용.
 *
 * 에러 코드:
 * - 400: 코드에 해당하는 토너먼트 없음 (`초대 코드가 올바르지 않습니다.`)
 * - 409: PENDING 아닌 상태 또는 만료 (`초대 링크가 만료되었습니다.`)
 */
export const getInvitePreviewByCode = async (code: string) => {
  const { data } = await clientApi.get<ApiResponseT<GetInvitePreviewResponseT>>(
    ENDPOINTS.TOURNAMENT_INVITE_PREVIEW_BY_CODE,
    { params: { code } }
  );
  return data.data;
};
