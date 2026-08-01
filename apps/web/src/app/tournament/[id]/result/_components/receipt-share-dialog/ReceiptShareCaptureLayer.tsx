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
 * 시안 스펙: 1080x1920 고정 캔버스, 영수증 폭 738(양옆 여백 171), 상품 수가 적으면 영수증이
 * 세로 중앙에 놓이고 장바구니는 하단 고정. 여기서는 정확히 1/2 인 540x960 으로 렌더하고
 * 캡처 시 pixelRatio 2 로 확대해 1080x1920 을 얻는다 (captureReceiptImage 가 폭 기준으로 역산).
 *
 * 뷰포트 밖(left)에 실제 크기로 렌더 — display:none 이면 레이아웃이 잡히지 않아 캡처가 비어버린다.
 */
const ReceiptShareCaptureLayer = forwardRef<HTMLDivElement, ReceiptShareCaptureLayerProps>(
  function ReceiptShareCaptureLayer({ tournamentId, tournamentName, result, date }, ref) {
    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="relative flex h-240 w-135 flex-col items-center justify-center bg-sky-blue-200 px-21.25"
        >
          {/* 영수증은 상단 그라데이션(-top-6)·하단 톱니(top-full)가 밖으로 튀어나와 그만큼 자리를 비워둔다 */}
          <div className="w-full pt-6 pb-4.5">
            <ReceiptPaper
              tournamentId={tournamentId}
              tournamentName={tournamentName}
              result={result}
              date={date}
            />
          </div>
          {/* 장바구니는 캔버스 하단 고정 (시안 y=1766/1920) */}
          <PikiLogoCart aria-hidden className="absolute bottom-11 h-8 w-11 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
