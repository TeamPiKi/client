'use client';

import { useRouter } from 'next/navigation';

import { LockIconFill } from '@/assets/icons';
import PiKiLogo from '@/assets/images/piki-logo-text.svg';
import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { getLoginPath } from '@/utils/loginRedirect';

type WishLoginRequiredProps = {
  /** '홈으로 돌아가기' 동작 — 미지정 시 홈으로 이동 (홈 오버레이에서는 닫기 핸들러 주입) */
  onGoHome?: () => void;
};

/** 게스트가 위시에 접근할 때 로그인을 유도하는 전체 화면 */
function WishLoginRequired({ onGoHome }: WishLoginRequiredProps) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push(getLoginPath(ROUTES.WISHLIST));
  };

  const handleGoHomeClick = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }
    router.push(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-linear-to-b from-white to-gray-50 px-5 pt-padding-top">
      <Header left={<PiKiLogo aria-label="PIKI" />} right={<HeaderIcon name="ALARM" />} />

      <main className="flex flex-1 flex-col items-center justify-center gap-[25px] pb-[100px]">
        <LockIconFill width={60} height={60} className="text-sky-blue-400" aria-hidden />

        <div className="flex flex-col items-center gap-[30px]">
          <h2 className="heading-1-semibold text-text-neutral-primary">
            위시를 담으려면 로그인이 필요해요
          </h2>

          <div className="flex flex-col items-center gap-6">
            <Button variant="primary" size="md" onClick={handleLoginClick}>
              로그인하기
            </Button>
            <button
              type="button"
              onClick={handleGoHomeClick}
              className="cursor-pointer body-1-medium text-text-neutral-secondary"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WishLoginRequired;
