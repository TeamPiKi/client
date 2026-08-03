import { forwardRef, useLayoutEffect, useRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

const RECEIPT_ZOOM = 1.28;
const RECEIPT_RENDER_WIDTH_PX = 370 / RECEIPT_ZOOM;

const RECEIPT_BOX_HEIGHT_PX = 748;

type ReceiptShareCaptureLayerProps = {
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

const ReceiptShareCaptureLayer = forwardRef<HTMLDivElement, ReceiptShareCaptureLayerProps>(
  function ReceiptShareCaptureLayer({ tournamentId, tournamentName, result, date }, ref) {
    const paperRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);

    /** 내용이 고정 영역을 넘치면 zoom 을 낮춰 맞춘다 */
    useLayoutEffect(() => {
      const paper = paperRef.current;
      const zoomWrap = zoomRef.current;
      if (!paper || !zoomWrap) return;

      /** 이전 축소가 남아 있으면 높이를 잘못 재므로 기준값으로 되돌리고 측정 */
      zoomWrap.style.zoom = String(RECEIPT_ZOOM);
      const paperHeight = paper.scrollHeight;
      if (!paperHeight) return;

      const fitZoom = Math.min(RECEIPT_ZOOM, RECEIPT_BOX_HEIGHT_PX / paperHeight);
      zoomWrap.style.zoom = String(fitZoom);
    }, [result, tournamentName, date]);

    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="flex h-240 w-135 flex-col items-center justify-center gap-6 bg-sky-blue-200 py-12"
        >
          <div
            className="flex w-92.5 items-center justify-center pt-8.5 pb-6.5"
            style={{ height: RECEIPT_BOX_HEIGHT_PX }}
          >
            <div ref={zoomRef} style={{ zoom: RECEIPT_ZOOM, width: RECEIPT_RENDER_WIDTH_PX }}>
              <div ref={paperRef}>
                <ReceiptPaper
                  tournamentId={tournamentId}
                  tournamentName={tournamentName}
                  result={result}
                  date={date}
                />
              </div>
            </div>
          </div>
          <PikiLogoCart aria-hidden className="h-8 w-11 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
