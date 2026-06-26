import Image from 'next/image';

import { getMe } from '@/apis/getMe';
import { SadIconFill } from '@/assets/icons';
import { Header, HeaderIcon } from '@/components/header';

import Basket from './_assets/basket.png';
import WithdrawConfirmDialog from './_components/WithdrawConfirmDialog';

async function MypageWithdrawPage() {
  const userData = await getMe();

  return (
    <div className="flex h-dvh flex-col items-center bg-bg-layer-basement px-5 pt-padding-top">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="회원탈퇴"
        centerClassName="title-1 text-text-neutral-primary"
      />

      <div className="hide-scrollbar flex w-full flex-1 flex-col items-center justify-center gap-12 overflow-y-auto pb-[98px]">
        <div className="flex w-full flex-col items-center gap-[15px]">
          <SadIconFill className="size-[74px] text-gray-100" aria-hidden />
          <p className="text-center heading-2 text-text-neutral-secondary">
            {userData.nickname}님, PiKi를 떠나시나요?
          </p>
          <p className="text-center body-2-medium break-keep text-text-neutral-tertiary">
            지금까지의 토너먼트 기록, 위시템 기록이 전부 사라져요.
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
