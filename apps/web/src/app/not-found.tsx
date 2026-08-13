import Link from 'next/link';

import BasketNotFoundIcon from '@/assets/images/basket-not-found.svg';
import { buttonStyles } from '@/components/button/button.style';
import ErrorScreen from '@/components/common/error-screen';
import { ROUTES } from '@/consts/route';

function NotFound() {
  return (
    <ErrorScreen
      Icon={BasketNotFoundIcon}
      title="페이지를 찾을 수 없어요"
      description="링크가 잘못되었거나 삭제된 페이지예요"
    >
      <Link href={ROUTES.HOME} className={buttonStyles({ variant: 'primary', size: 'md' })}>
        홈으로 가기
      </Link>
    </ErrorScreen>
  );
}

export default NotFound;
