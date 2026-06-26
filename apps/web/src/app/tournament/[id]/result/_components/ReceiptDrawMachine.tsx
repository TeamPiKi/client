'use client';

import { gsap } from 'gsap';
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

import ReceiptPrinterImg from '@/assets/images/tournament/result/receipt-printer.png';

import type { RankedProductT } from '../../_common/_types/tournament';
import ReceiptPaper from './ReceiptPaper';

/** 프린터 래퍼 aspect ratio (디자인 박스) */
const PRINTER_ASPECT_NUMERATOR = 267;
const PRINTER_ASPECT_DENOMINATOR = 62;

/**
 * 디자인 기준: 컨테이너가 최대 420px 너비일 때 영수증 오버레이 top이 53px로 맞춰져 있음.
 * 너비가 줄면 프린터 박스 높이도 비례해 줄므로, 동일 시각 비율을 유지하기 위해 높이에 선형 스케일 적용.
 */
const RECEIPT_TOP_AT_MAX_PRINTER_WIDTH_PX = 53;
const MAX_PRINTER_CONTAINER_WIDTH_PX = 420;
const REFERENCE_PRINTER_FRAME_HEIGHT_PX =
  (MAX_PRINTER_CONTAINER_WIDTH_PX * PRINTER_ASPECT_DENOMINATOR) / PRINTER_ASPECT_NUMERATOR;
const RECEIPT_TOP_PER_PRINTER_HEIGHT =
  RECEIPT_TOP_AT_MAX_PRINTER_WIDTH_PX / REFERENCE_PRINTER_FRAME_HEIGHT_PX;

type ReceiptDrawMachineProps = {
  tournamentName: string;
  result: RankedProductT[];
  date: Date;
};

/** 외부에서 영수증 종이 DOM 을 캡처할 때 사용 (예: 영수증 이미지 공유) */
export type ReceiptDrawMachineHandleT = {
  getReceiptPaperElement: () => HTMLDivElement | null;
};

const ReceiptDrawMachine = forwardRef<ReceiptDrawMachineHandleT, ReceiptDrawMachineProps>(
  function ReceiptDrawMachine({ tournamentName, result, date }, ref) {
    const animationScopeRef = useRef<HTMLDivElement | null>(null);
    const printerFrameRef = useRef<HTMLDivElement | null>(null);
    const receiptPaperRef = useRef<HTMLDivElement | null>(null);
    const slotBarRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        // 캡처 대상은 wrapper(transform 으로 애니메이션 / clip-path 마스크 영향) 가 아니라
        // 그 안의 실제 영수증 종이 element.
        getReceiptPaperElement: () =>
          (receiptPaperRef.current?.firstElementChild as HTMLDivElement | null) ?? null,
      }),
      []
    );
    const [receiptTopPx, setReceiptTopPx] = useState(RECEIPT_TOP_AT_MAX_PRINTER_WIDTH_PX);

    useLayoutEffect(() => {
      const frame = printerFrameRef.current;
      if (!frame) return;

      const updateReceiptTop = () =>
        setReceiptTopPx(frame.getBoundingClientRect().height * RECEIPT_TOP_PER_PRINTER_HEIGHT);

      updateReceiptTop();
      const resizeObserver = new ResizeObserver(updateReceiptTop);
      resizeObserver.observe(frame);
      return () => resizeObserver.disconnect();
    }, []);

    useLayoutEffect(() => {
      const animationScopeElement = animationScopeRef.current;
      const receiptPaperElement = receiptPaperRef.current;
      const slotBarElement = slotBarRef.current;

      if (!animationScopeElement || !receiptPaperElement || !slotBarElement) return;

      const context = gsap.context(() => {
        const receiptHeight = receiptPaperElement.getBoundingClientRect().height;
        const startY = receiptHeight;

        gsap.set(slotBarElement, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          transformOrigin: 'center center',
        });
        gsap.set(receiptPaperElement, {
          x: 0,
          y: -startY,
          rotation: 0,
          skewX: 0,
          skewY: 0,
          transformOrigin: '50% 0%',
        });

        const timeline = gsap.timeline({ defaults: { ease: 'power2.out' }, repeat: 0 });

        timeline
          .to(slotBarElement, {
            duration: 0.18,
            scaleX: 1,
            scaleY: 1.1,
            transformOrigin: 'center center',
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 2,
          })
          .to(
            receiptPaperElement,
            { duration: 1.45, x: 0, y: 0, rotation: 0, ease: 'power3.out' },
            '-=0.08'
          )
          .to(
            slotBarElement,
            {
              duration: 0.22,
              scaleX: 1,
              scaleY: 1,
              transformOrigin: 'center center',
              ease: 'power1.out',
            },
            '<0.35'
          )
          .set(receiptPaperElement, {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
          })
          .set(slotBarElement, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
      }, animationScopeElement);

      return () => context.revert();
    }, []);

    return (
      <div
        className="relative isolate flex min-h-0 w-full flex-1 flex-col items-center"
        ref={animationScopeRef}
      >
        {/* 프린터 (먼저 렌더) */}
        <div
          className="relative z-30 w-full shrink-0"
          ref={printerFrameRef}
          style={{ aspectRatio: `${PRINTER_ASPECT_NUMERATOR}/${PRINTER_ASPECT_DENOMINATOR}` }}
        >
          <Image
            src={ReceiptPrinterImg}
            alt="영수증 기계"
            className="h-full w-full object-contain"
            preload
          />
          <div className="absolute inset-x-0 bottom-0 h-1.25" ref={slotBarRef} />
        </div>

        {/* 영수증 종이 영역 공간 확보 (layout reserved) */}
        <div className="invisible mx-auto w-[74%]" aria-hidden>
          <ReceiptPaper tournamentName={tournamentName} result={result} date={date} />
        </div>

        {/* 영수증 마스크 — 슬롯 위치(top)부터 컨테이너 끝(bottom-0)까지, 프린터 위로(z-40) 덮음.
          상단만 자르고 좌우는 열어둬야 1위 트로피 뱃지가 종이 밖으로 살짝 나갈 수 있다. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 [clip-path:inset(0_-100vw_-100vw_-100vw)]"
          style={{ top: `${receiptTopPx}px` }}
        >
          <div
            ref={receiptPaperRef}
            className="pointer-events-auto mx-auto h-fit w-[74%] will-change-transform"
          >
            <ReceiptPaper tournamentName={tournamentName} result={result} date={date} />
          </div>
        </div>
      </div>
    );
  }
);

export default ReceiptDrawMachine;
