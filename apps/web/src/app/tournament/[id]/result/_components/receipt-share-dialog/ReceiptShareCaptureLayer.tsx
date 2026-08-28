import { forwardRef, useLayoutEffect, useRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

/** 좁은 폭으로 레이아웃한 뒤 zoom 으로 확대해 최종 폭을 만든다 */
const RECEIPT_PAPER_WIDTH_PX = 370;
const RECEIPT_ZOOM = 1.42;
const RECEIPT_RENDER_WIDTH_PX = RECEIPT_PAPER_WIDTH_PX / RECEIPT_ZOOM;

/** 이 높이를 넘길 때만 배율을 낮춘다 */
const RECEIPT_MAX_HEIGHT_PX = 737;

/** ReceiptPaper 하단 물결(h-4.5). absolute 라 종이 높이에 안 잡힌다 */
const RECEIPT_ZIGZAG_HEIGHT_PX = 18;

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
    const logoAreaRef = useRef<HTMLDivElement>(null);

    /**
     * 배율을 낮추면 레이아웃 폭이 넓어져 긴 상품명의 줄바꿈이 달라지고, 그러면 높이가 다시
     * 변한다. 한 번만 계산하면 이 되먹임 때문에 결과가 어긋나므로 값이 안정될 때까지 반복한다.
     * 줄바꿈은 계단식이라 두 값을 오갈 수 있어, 그중 상한을 넘지 않는 최대 배율을 고른다.
     */
    useLayoutEffect(() => {
      const paper = paperRef.current;
      const zoomWrap = zoomRef.current;
      if (!paper || !zoomWrap) return;

      let best = 0;
      let candidate = RECEIPT_ZOOM;

      for (let i = 0; i < 6; i += 1) {
        zoomWrap.style.zoom = String(candidate);
        zoomWrap.style.width = `${RECEIPT_PAPER_WIDTH_PX / candidate}px`;

        const height = paper.scrollHeight * candidate;
        if (!height) return;

        if (height <= RECEIPT_MAX_HEIGHT_PX) best = Math.max(best, candidate);

        const next = Math.min(RECEIPT_ZOOM, (candidate * RECEIPT_MAX_HEIGHT_PX) / height);
        if (Math.abs(next - candidate) < 0.002) break;
        candidate = next;
      }

      const fitZoom = best || candidate;
      zoomWrap.style.zoom = String(fitZoom);
      zoomWrap.style.width = `${RECEIPT_PAPER_WIDTH_PX / fitZoom}px`;

      /** 물결 높이를 여백으로 되돌려야 로고가 물결 끝 기준으로 가운데 온다 */
      if (logoAreaRef.current) {
        logoAreaRef.current.style.paddingTop = `${RECEIPT_ZIGZAG_HEIGHT_PX * fitZoom}px`;
      }
    }, [result, tournamentName, date]);

    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div ref={ref} className="flex h-240 w-135 flex-col items-center bg-sky-blue-200 pt-27.75">
          <div className="flex w-92.5 items-center justify-center">
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

          {/* 종이 아래 남는 공간의 한가운데에 로고를 둔다 */}
          <div ref={logoAreaRef} className="flex flex-1 items-center justify-center">
            <PikiLogoCart aria-hidden className="h-8 w-11 shrink-0 text-white" />
          </div>
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
