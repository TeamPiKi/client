import { forwardRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

type ReceiptShareCaptureLayerProps = {
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

/**
 * 공유 이미지 전용 캡처 레이어 — 화면에 보이는 영수증(ReceiptDrawMachine)은 프린터 연출·마스크가
 * 얽혀 있어 그대로 캡처하면 잘린다. 공유용은 하늘색 배경 + 영수증 + 장바구니만 따로 그려 캡처한다.
 *
 * 뷰포트 밖(left:-9999px)에 실제 크기로 렌더 — display:none 이면 레이아웃이 잡히지 않아 캡처가 비어버린다.
 */
const ReceiptShareCaptureLayer = forwardRef<HTMLDivElement, ReceiptShareCaptureLayerProps>(
  function ReceiptShareCaptureLayer({ tournamentId, tournamentName, result, date }, ref) {
    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="flex w-90 flex-col items-center gap-8 bg-sky-blue-200 px-6 pt-6 pb-8"
        >
          {/* 영수증 하단 톱니가 absolute top-full 로 18px 튀어나와 그만큼 자리를 비워둔다 */}
          <div className="w-full pb-4.5">
            <ReceiptPaper
              tournamentId={tournamentId}
              tournamentName={tournamentName}
              result={result}
              date={date}
            />
          </div>
          <PikiLogoCart aria-hidden className="h-6 w-8.25 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
