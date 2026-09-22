'use client';

import type { GuestBlockLocationT } from '@/consts/guestBlockLocation';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import LoginRequired from '.';

type LoginRequiredPageProps = {
  title: string;
  redirectPath: string;
  location: GuestBlockLocationT;
};

/** 라우트 전체를 대체하는 페이지판 — 서버 레이아웃이 핸들러 없이 쓰도록 back(진입 화면이면 홈 대체)을 채워 위임 */
function LoginRequiredPage({ title, redirectPath, location }: LoginRequiredPageProps) {
  const backWithFallback = useBackWithFallback();

  return (
    <LoginRequired
      title={title}
      redirectPath={redirectPath}
      location={location}
      onGoBack={() => backWithFallback(ROUTES.HOME)}
    />
  );
}

export default LoginRequiredPage;
