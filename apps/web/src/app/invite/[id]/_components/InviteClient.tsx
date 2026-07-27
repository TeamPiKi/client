'use client';

import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { getMe } from '@/apis/getMe';
import { getInvitePreviewByCode } from '@/app/tournament/join/_apis/getInvitePreviewByCode';
import { postJoin } from '@/app/tournament/join/_apis/postJoin';
import Button from '@/components/button';
import Spinner from '@/components/spinner';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';

type InviteClientProps = {
  tournamentId: number;
  inviteCode: string;
};

type InviteStateT = 'loading' | 'invalid';

function InviteClient({ tournamentId, inviteCode }: InviteClientProps) {
  const router = useRouter();
  const [state, setState] = useState<InviteStateT>('loading');
  const [isTournamentErrorDialogOpen, setIsTournamentErrorDialogOpen] = useState(false);

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const joinAsMemberAndGoToCreate = async () => {
      try {
        await postJoin({
          tournamentId,
          body: { inviteCode },
        });

        router.replace(
          `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.WELCOME_JOIN}`
        );
      } catch (error) {
        if (isAxiosError<ApiErrorResponseT>(error) && error.response?.status === 409) {
          setState('invalid');
          setIsTournamentErrorDialogOpen(true);
          return;
        }

        setState('invalid');
      }
    };

    const run = async () => {
      /** 코드 없이 진입 → 잘못된 링크 */
      if (!inviteCode) {
        setState('invalid');
        return;
      }

      try {
        const preview = await getInvitePreviewByCode(inviteCode);
        /** 코드의 토너먼트가 URL path와 다르면 잘못된 링크 */
        if (preview.tournamentId !== tournamentId) {
          setState('invalid');
          return;
        }

        /**
         * 이미 참여한 유저(멤버·게스트 공통)가 같은 링크로 재진입하면 join 플로우를 건너뛰고
         * 토너먼트로 바로 진입. preview 응답의 joined 로 판별 — 별도 조회 없이 preview 한 번으로 끝난다.
         */
        if (preview.joined) {
          router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
          return;
        }

        const user = await getMe().catch(() => null);
        if (user?.identityType === 'MEMBER') {
          await joinAsMemberAndGoToCreate();
          return;
        }

        router.replace(`${ROUTES.TOURNAMENT_JOIN_BY_LINK(tournamentId)}?code=${inviteCode}`);
      } catch (error) {
        if (isAxiosError<ApiErrorResponseT>(error) && error.response?.status === 409) {
          setState('invalid');
          setIsTournamentErrorDialogOpen(true);
          return;
        }

        /** 400 (코드 불일치) / 네트워크 등 */
        setState('invalid');
      }
    };

    void run();
  }, [router, tournamentId, inviteCode]);

  if (state === 'loading') {
    return (
      <>
        <main className="flex min-h-dvh items-center justify-center bg-bg-layer-basement pt-padding-top">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="body-1-medium text-text-neutral-tertiary">
              초대 정보를 확인하고 있어요...
            </p>
          </div>
        </main>

        <TournamentErrorDialog
          type="LINK_EXPIRED"
          open={isTournamentErrorDialogOpen}
          onOpenChange={setIsTournamentErrorDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg-layer-basement px-5 pt-padding-top">
        <div className="flex flex-col items-center gap-2">
          <p className="heading-1-bold text-text-neutral-primary">초대 링크가 유효하지 않아요</p>
          <p className="text-center body-1-medium text-text-neutral-tertiary">
            만료됐거나 잘못된 링크일 수 있어요.
            <br />
            친구에게 새 링크를 요청해주세요.
          </p>
        </div>

        <Link href={ROUTES.HOME} className="w-full max-w-80">
          <Button size="lg" variant="primary" className="w-full">
            홈으로 가기
          </Button>
        </Link>
      </main>

      {/** TODO: 409는 초대 코드 만료, 이미 참여 중, 이미 시작된 토너먼트 등 여러 경우가 있음 따라서 타입을 동적으로 설정할 수 있어야 하나, 서버에서 에러코드를 내려주지 않기 때문에 일단 단일 타입으로 처리*/}
      <TournamentErrorDialog
        type="LINK_EXPIRED"
        open={isTournamentErrorDialogOpen}
        onOpenChange={setIsTournamentErrorDialogOpen}
      />
    </>
  );
}

export default InviteClient;
