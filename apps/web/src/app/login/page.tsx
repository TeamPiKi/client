import { WEBVIEW_UA_TOKEN } from '@piki/core';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getRoleFromToken } from '@/utils/auth';
import { getLoginRedirectPath } from '@/utils/loginRedirect';

import LoginButtons from './_components/LoginButtons';
import OnboardingGate from './_components/OnboardingGate';

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string; action?: string; code?: string }>;
};

async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectParam, action, code } = await searchParams;

  /**
   * 멤버가 로그인 페이지 진입 시 redirect 경로로, 없으면 홈으로 리다이렉트
   * - 세션 만료나 탈퇴한 경우에는 리다이렉트하지 않음
   */
  const accessToken = (await cookies()).get('access_token')?.value;
  const role = getRoleFromToken(accessToken);
  if (
    role === 'MEMBER' &&
    !(
      action === QUERY_ACTION.VALUE.SESSION_EXPIRED ||
      action === QUERY_ACTION.VALUE.WITHDRAWN_ACCOUNT
    )
  )
    redirect(getLoginRedirectPath(redirectParam));

  /**
   * Android 웹뷰에서는 Apple 로그인 미노출.
   * 앱의 Apple 로그인은 iOS 전용 네이티브 모듈(expo-apple-authentication)로 처리되어
   * Android 에서 선택 시 항상 실패한다. (일반 Android 브라우저는 웹 OAuth 라 정상 동작)
   */
  const userAgent = (await headers()).get('user-agent') ?? '';
  const isAndroidWebview = userAgent.includes(WEBVIEW_UA_TOKEN) && /android/i.test(userAgent);

  const showOnboarding = !redirectParam && !action && !code;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-bg-layer-default to-bg-layer-basement px-5 pt-padding-top pb-10">
      {showOnboarding && <OnboardingGate />}

      <div className="flex w-full flex-col items-center">
        <PikiLogo aria-label="PiKi" className="h-[86px] w-[117px] shrink-0 text-sky-blue-400" />

        <h1 className="mt-7 text-center heading-1-bold text-text-neutral-primary">
          매일 쌓여만 가던
          <br />
          위시리스트가 오늘의 결정으로
        </h1>

        <div className="mt-[110px] w-full animate-in duration-500 fade-in-0">
          <LoginButtons
            redirect={redirectParam ?? null}
            action={action ?? null}
            errorCode={code ?? null}
            showAppleLogin={!isAndroidWebview}
          />

          <p className="mt-[26px] text-center caption-1-semibold text-text-neutral-tertiary">
            가입 시{' '}
            <Link
              href={ROUTES.TERMS}
              className="underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]"
            >
              이용약관
            </Link>
            {' 및 '}
            <Link
              href={ROUTES.POLICY}
              className="underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]"
            >
              개인정보 처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
