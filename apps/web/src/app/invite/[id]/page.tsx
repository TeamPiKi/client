import { notFound, redirect } from 'next/navigation';

import { getInvitePreviewByCode } from '@/apis/getInvitePreviewByCode';
import { ROUTES } from '@/consts/route';
import { getApiErrorStatus, isServerOrNetworkError } from '@/utils/apiError';
import { parseIdParam } from '@/utils/parseIdParam';

import InviteInvalid from './_components/InviteInvalid';

type InvitePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
};

async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { id } = await params;
  const { code } = await searchParams;
  const tournamentId = parseIdParam(id);

  if (tournamentId === null) notFound();

  /** 코드 없이 진입 → 잘못된 링크 */
  if (!code) return <InviteInvalid />;

  /** redirect() 는 throw 방식이라 try 밖에서 호출 — preview 조회만 감싼다 */
  let preview;
  try {
    preview = await getInvitePreviewByCode(code);
  } catch (error) {
    /** 5xx·네트워크는 링크 문제가 아니므로 에러 바운더리(재시도 UI)로 넘긴다 */
    if (isServerOrNetworkError(error)) throw error;

    /** 409(만료·비활성 초대)는 만료 다이얼로그 노출, 그 외(400 코드 불일치 등)는 안내 화면만 */
    return <InviteInvalid showExpiredDialog={getApiErrorStatus(error) === 409} />;
  }

  /** 코드의 토너먼트가 URL path 와 다르면 잘못된 링크 */
  if (preview.tournamentId !== tournamentId) return <InviteInvalid />;

  /** 이미 참여한 유저(회원·게스트 공통) → join 건너뛰고 토너먼트로 바로 진입 */
  if (preview.joined) redirect(ROUTES.TOURNAMENT_CREATE(tournamentId));

  /** 미참여 → 참여 방식(회원 자동 / 게스트 닉네임 입력)은 join 페이지가 소유 */
  redirect(`${ROUTES.TOURNAMENT_JOIN_BY_LINK(tournamentId)}?code=${encodeURIComponent(code)}`);
}

export default InvitePage;
