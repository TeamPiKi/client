import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetInvitePreviewResponseT } from '@/types/tournament';

/**
 * 초대 코드로 토너먼트 미리보기.
 * 홈 다이얼로그와 /join/id에서 사용.
 * 응답으로 받은 tournamentId 를 이후 /join 호출에 사용.
 *
 * 에러 코드:
 * - 400: 코드에 해당하는 토너먼트 없음 (`초대 코드가 올바르지 않습니다.`)
 * - 409: PENDING 아닌 상태 또는 만료 (`초대 링크가 만료되었습니다.`)
 */
export const getInvitePreviewByCode = async (code: string) => {
  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetInvitePreviewResponseT>>(
      ENDPOINTS.TOURNAMENT_INVITE_PREVIEW_BY_CODE,
      { params: { code } }
    );
    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetInvitePreviewResponseT>>(
    ENDPOINTS.TOURNAMENT_INVITE_PREVIEW_BY_CODE,
    { params: { code } }
  );
  return data.data;
};
