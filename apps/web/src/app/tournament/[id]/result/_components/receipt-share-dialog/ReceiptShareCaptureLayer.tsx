import { forwardRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

const RECEIPT_ZOOM = 1.44;
const RECEIPT_RENDER_WIDTH_PX = 370 / RECEIPT_ZOOM;

type ReceiptShareCaptureLayerProps = {
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

/** 공유 이미지(1080x1920) 전용 캡처 레이어 — 1/2 크기로 렌더하고 캡처 시 2배 확대된다 */
const ReceiptShareCaptureLayer = forwardRef<HTMLDivElement, ReceiptShareCaptureLayerProps>(
  function ReceiptShareCaptureLayer({ tournamentId, tournamentName, result, date }, ref) {
    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="relative flex h-240 w-135 flex-col items-center justify-center bg-sky-blue-200"
        >
          {/* 상단 그라데이션(-top-6)·하단 톱니(top-full)가 밖으로 튀어나와 자리를 비워둔다 */}
          <div
            className="pt-6 pb-4.5"
            style={{ zoom: RECEIPT_ZOOM, width: RECEIPT_RENDER_WIDTH_PX }}
          >
            <ReceiptPaper
              tournamentId={tournamentId}
              tournamentName={tournamentName}
              result={result}
              date={date}
            />
          </div>
          <PikiLogoCart aria-hidden className="absolute bottom-11 h-8 w-11 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
