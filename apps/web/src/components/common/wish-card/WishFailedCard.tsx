import { WarningIconFill } from '@/assets/icons';

import WishStatusFrame from './WishStatusFrame';

/** FAILED 위시 카드 — 정보를 전혀 못 가져와 직접 입력을 유도한다 */
function WishFailedCard() {
  return (
    <WishStatusFrame>
      <WarningIconFill className="size-6 text-icon-neutral-secondary" />
      <p className="body-2-semibold text-text-neutral-secondary">가져오는데 실패했어요</p>
      <p className="body-2-medium text-text-neutral-secondary underline underline-offset-[3px]">
        직접 입력하기
      </p>
    </WishStatusFrame>
  );
}

export default WishFailedCard;
