'use client';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import LoginRequired from '.';

type LoginRequiredPageProps = {
  title: string;
  redirectPath: string;
};

/** 라우트 전체를 대체하는 페이지판 — 서버 레이아웃이 핸들러 없이 쓰도록 back(진입 화면이면 홈 대체)을 채워 위임 */
function LoginRequiredPage({ title, redirectPath }: LoginRequiredPageProps) {
  const backWithFallback = useBackWithFallback();

  return (
    <LoginRequired
      title={title}
      redirectPath={redirectPath}
      onGoBack={() => backWithFallback(ROUTES.HOME)}
    />
  );
}

export default LoginRequiredPage;
