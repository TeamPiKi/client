import BasketWithdrawIcon from '@/assets/images/basket-withdraw.svg';
import { Header, HeaderIcon } from '@/components/header';

import WithdrawConfirmDialog from './_components/WithdrawConfirmDialog';
import WithdrawGreeting from './_components/WithdrawGreeting';

// me 조회·MEMBER 검증은 상위 layout 담당 — 페이지에서 중복 await 하지 않는다 (이중 블로킹 제거)
function MypageWithdrawPage() {
  return (
    <div className="flex h-dvh flex-col bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">회원탈퇴</h1>}
      />

      <div className="hide-scrollbar flex w-full flex-1 flex-col items-center overflow-y-auto pb-[98px] pt-[124.5px]">
        <BasketWithdrawIcon aria-hidden className="size-[60px] shrink-0" />
        <div className="mt-[15px] flex flex-col items-center gap-3">
          <WithdrawGreeting />
          <p className="break-keep text-center body-2-medium text-text-neutral-tertiary">
            지금까지의 토너먼트 기록, 위시 기록이 전부 사라져요.
          </p>
        </div>
      </div>

      <WithdrawConfirmDialog />
    </div>
  );
}

export default MypageWithdrawPage;
