import { forwardRef, useLayoutEffect, useRef } from 'react';

import PikiLogoCart from '@/assets/images/piki-logo-cart.svg';

import type { RankedProductT } from '../../../_common/_types/tournament';
import ReceiptPaper from '../ReceiptPaper';

/** 좁은 폭으로 레이아웃한 뒤 zoom 으로 확대해 최종 폭을 만든다 */
const RECEIPT_PAPER_WIDTH_PX = 370;
const RECEIPT_ZOOM = 1.42;
const RECEIPT_RENDER_WIDTH_PX = RECEIPT_PAPER_WIDTH_PX / RECEIPT_ZOOM;

/** 이 높이를 넘길 때만 배율을 낮춘다 — 로고 위까지 남는 공간 */
const RECEIPT_MAX_HEIGHT_PX = 750;

/** 공유 이미지 전용 상품명 크기 — 화면 영수증은 읽기 크기를 유지한다 */
const SHARE_PRODUCT_NAME_FONT_SIZE_PX = 12.2;
const SHARE_PRODUCT_NAME_LINE_HEIGHT_PX = 17.4;

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

    /**
     * 배율을 낮추면 레이아웃 폭이 넓어져 긴 상품명의 줄바꿈이 달라지고, 그러면 높이가 다시
     * 변한다. 한 번만 계산하면 이 되먹임 때문에 결과가 어긋나므로 값이 안정될 때까지 반복한다.
     * 줄바꿈은 계단식이라 두 값을 오갈 수 있어, 그중 상한을 넘지 않는 최대 배율을 고른다.
     */
    useLayoutEffect(() => {
      const paper = paperRef.current;
      const zoomWrap = zoomRef.current;
      if (!paper || !zoomWrap) return;

      /** 상품명만 시안 크기로 낮춘다 */
      paper.querySelectorAll<HTMLElement>('[data-receipt-product-name]').forEach(name => {
        name.style.fontSize = `${SHARE_PRODUCT_NAME_FONT_SIZE_PX}px`;
        name.style.lineHeight = `${SHARE_PRODUCT_NAME_LINE_HEIGHT_PX}px`;
      });

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
    }, [result, tournamentName, date]);

    return (
      <div aria-hidden className="pointer-events-none fixed top-0 -left-250">
        <div
          ref={ref}
          className="flex h-240 w-135 flex-col items-center justify-between bg-sky-blue-200 pt-21.75 pb-11.25"
        >
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

          <PikiLogoCart aria-hidden className="h-8 w-11 shrink-0 text-white" />
        </div>
      </div>
    );
  }
);

export default ReceiptShareCaptureLayer;
