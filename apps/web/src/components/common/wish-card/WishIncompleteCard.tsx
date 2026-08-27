import { WarningIconFill } from '@/assets/icons';

import WishStatusFrame from './WishStatusFrame';

/** INCOMPLETE 위시 카드 — 일부 정보만 가져와 나머지 입력을 유도한다 */
function WishIncompleteCard() {
  return (
    <WishStatusFrame>
      <WarningIconFill className="size-6 text-icon-neutral-secondary" />
      <p className="body-2-semibold text-text-neutral-secondary">일부 정보만 가져왔어요</p>
      <p className="body-2-medium text-text-neutral-secondary underline underline-offset-[3px]">
        직접 입력하기
      </p>
    </WishStatusFrame>
  );
}

export default WishIncompleteCard;
