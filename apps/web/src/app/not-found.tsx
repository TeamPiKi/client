import Link from 'next/link';

import { CloseCircularIconFill } from '@/assets/icons';
import { ROUTES } from '@/consts/route';

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center gap-6 bg-bg-layer-basement pt-40">
      <div className="flex flex-col items-center gap-4">
        <CloseCircularIconFill className="size-20 text-icon-neutral-secondary" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="heading-1-bold text-text-neutral-secondary">페이지를 찾을 수 없어요.</h1>
          <p className="body-1-semibold text-text-neutral-tertiary">
            링크가 잘못되었거나 삭제된 페이지예요.
          </p>
        </div>
      </div>
      <Link
        href={ROUTES.HOME}
        className="inline-flex items-center justify-center rounded-xl border-[1.2px] border-gray-200 bg-bg-layer-floating px-4.5 py-2.5 body-1-semibold text-text-neutral-primary"
      >
        홈으로 가기
      </Link>
    </div>
  );
}

export default NotFound;
