import Image from 'next/image';

import { SadIconFill } from '@/assets/icons';
import { Header, HeaderIcon } from '@/components/header';

import Basket from './_assets/basket.png';
import WithdrawConfirmDialog from './_components/WithdrawConfirmDialog';
import WithdrawGreeting from './_components/WithdrawGreeting';

// me 조회·MEMBER 검증은 상위 layout 담당 — 페이지에서 중복 await 하지 않는다 (이중 블로킹 제거)
function MypageWithdrawPage() {
  return (
    <div className="flex h-dvh flex-col items-center bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="회원탈퇴"
        centerClassName="heading-1-bold text-text-neutral-primary"
      />

      <div className="hide-scrollbar flex w-full flex-1 flex-col items-center justify-center gap-12 overflow-y-auto pb-[98px]">
        <div className="flex w-full flex-col items-center gap-[15px]">
          <SadIconFill className="size-[74px] text-gray-100" aria-hidden />
          <WithdrawGreeting />
          <p className="text-center body-2-medium break-keep text-text-neutral-tertiary">
            지금까지의 토너먼트 기록, 위시 기록이 전부 사라져요.
          </p>
        </div>

        <Image
          src={Basket}
          alt=""
          aria-hidden
          width={Basket.width}
          height={Basket.height}
          className="h-auto w-[calc(100%-34px)] max-w-[318px]"
          preload
        />
      </div>

      <WithdrawConfirmDialog />
    </div>
  );
}

export default MypageWithdrawPage;
