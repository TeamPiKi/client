import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import PikiLogo from '@/assets/images/piki-logo.svg';
import { ROUTES } from '@/consts/route';
import { isTokenValid } from '@/utils/auth';
import { isValidLoginRedirectPath } from '@/utils/loginRedirect';

import LoginButtons from './_components/LoginButtons';

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string; action?: string }>;
};

async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectParam, action } = await searchParams;

  // 이미 유효한 세션이 있으면 로그인 페이지를 건너뜀 (게스트·소셜 모두)
  // action이 있으면 세션 만료/소셜 오류 등 명시적 케이스 → 건너뛰지 않음
  if (!action) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    if (accessToken && isTokenValid(accessToken)) {
      redirect(isValidLoginRedirectPath(redirectParam) ? redirectParam : ROUTES.HOME);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-50 px-4 pt-padding-top pb-10">
      <div className="mt-15 flex flex-col items-center gap-6">
        <PikiLogo aria-label="PIKI" />
        <p className="text-center body-1-bold whitespace-pre-line text-text-neutral-secondary">
          {'매일 쌓여만 가던\n위시리스트가 오늘의 결정으로'}
        </p>
      </div>

      <div className="mt-[90px] w-full">
        <LoginButtons redirect={redirectParam ?? null} action={action ?? null} />
      </div>
    </div>
  );
}

export default LoginPage;
