'use client';

import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/button';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { ROUTES } from '@/consts/route';

type InviteInvalidProps = {
  /** 초대 만료(409) 로 진입한 경우 만료 다이얼로그를 함께 노출 */
  showExpiredDialog?: boolean;
};

function InviteInvalid({ showExpiredDialog = false }: InviteInvalidProps) {
  const [isTournamentErrorDialogOpen, setIsTournamentErrorDialogOpen] =
    useState(showExpiredDialog);

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

export default InviteInvalid;
