import Link from 'next/link';

import BasketNotFoundIcon from '@/assets/images/basket-not-found.svg';
import { buttonStyles } from '@/components/button/button.style';
import { ROUTES } from '@/consts/route';

function NotFound() {
  return (
    <div className="h-full bg-bg-layer-basement pt-padding-top">
      <div className="flex flex-col items-center gap-[30px] pt-[calc(253px_-_env(safe-area-inset-top))]">
        <div className="flex flex-col items-center gap-[25px]">
          <BasketNotFoundIcon className="size-15" aria-hidden />
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-1-semibold text-text-neutral-primary">페이지를 찾을 수 없어요</h1>
            <p className="body-1-medium text-text-neutral-tertiary">
              링크가 잘못되었거나 삭제된 페이지예요
            </p>
          </div>
        </div>
        <Link href={ROUTES.HOME} className={buttonStyles({ variant: 'primary', size: 'md' })}>
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
