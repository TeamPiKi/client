import Link from 'next/link';

import { getMe } from '@/apis/getMe';
import PikiLogo from '@/assets/images/piki-logo.svg';
import { ROUTES } from '@/consts/route';
import { getQueryClient } from '@/utils/queryClient';

import LoginButtons from './_components/LoginButtons';

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string; action?: string }>;
};

async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectParam, action } = await searchParams;

  /** 게스트 세션 재활용 가능 여부 판단 */
  const user = await getQueryClient()
    .fetchQuery({ queryKey: ['me'], queryFn: getMe })
    .catch(() => null);
  const canReuseGuestSession = user?.identityType === 'GUEST';

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-50 px-4 pt-padding-top pb-10">
      <div className="mt-15 flex flex-col items-center gap-6">
        <PikiLogo aria-label="PIKI" />
        <p className="text-center body-1-bold whitespace-pre-line text-text-neutral-secondary">
          {'매일 쌓여만 가던\n위시리스트가 오늘의 결정으로'}
        </p>
      </div>

      <div className="mt-[90px] w-full">
        <LoginButtons
          redirect={redirectParam ?? null}
          action={action ?? null}
          canReuseGuestSession={canReuseGuestSession}
        />

        <p className="mt-9 text-center font-features-['ss10'_on] text-[11px] leading-[150%] font-medium tracking-[-0.232px] text-text-neutral-tertiary">
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
  );
}

export default LoginPage;
