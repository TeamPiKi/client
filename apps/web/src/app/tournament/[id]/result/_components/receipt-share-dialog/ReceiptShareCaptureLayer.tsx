import { forwardRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

const RECEIPT_ZOOM = 1.28;
const RECEIPT_RENDER_WIDTH_PX = 370 / RECEIPT_ZOOM;

type ReceiptShareCaptureLayerProps = {
  tournamentId: number;
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

const ReceiptShareCaptureLayer = forwardRef<HTMLDivElement, ReceiptShareCaptureLayerProps>(
  function ReceiptShareCaptureLayer({ tournamentId, tournamentName, result, date }, ref) {
    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="flex h-240 w-135 flex-col items-center justify-center gap-6 bg-sky-blue-200 py-12"
        >
          <div className="w-92.5 pt-8.5 pb-6.5">
            <div style={{ zoom: RECEIPT_ZOOM, width: RECEIPT_RENDER_WIDTH_PX }}>
              <ReceiptPaper
                tournamentId={tournamentId}
                tournamentName={tournamentName}
                result={result}
                date={date}
              />
            </div>
          </div>
          <PikiLogoCart aria-hidden className="h-8 w-11 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
