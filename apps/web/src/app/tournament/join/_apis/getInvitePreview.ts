import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetInvitePreviewResponseT } from '@/types/tournament';

/**
 * 토너먼트 ID로 미리보기. 인증 불필요.
 * 링크 직접 접근 경로 (`piki.today/invite/{tournamentId}?code=XXX`).
 */
export const getInvitePreview = async (tournamentId: number, inviteCode?: string) => {
  const params = inviteCode ? { inviteCode } : {};

  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetInvitePreviewResponseT>>(
      ENDPOINTS.TOURNAMENT_INVITE_PREVIEW(tournamentId),
      { params }
    );
    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetInvitePreviewResponseT>>(
    ENDPOINTS.TOURNAMENT_INVITE_PREVIEW(tournamentId),
    { params }
  );
  return data.data;
};
