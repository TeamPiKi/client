import type { CSSProperties } from 'react';

import { FashionBagIcon, FashionCapIcon, FashionPantsIcon, FashionShirtIcon } from '@/assets/icons';

import './TournamentBracketAnimation.css';

// ── Design spec (based on 360px viewport) ─────────────────────────────────────
const C = 60; // card size
const G_FS = 54; // gap: final → semi
const G_SQ = 66; // gap: semi → quarter
const LW = 4; // stroke-width (Figma: 4px)
const W = 360; // design width

// X centers in design space (absolute px, used in SVG viewBox)
const Q_HALF = 50.5;
const S_HALF = 99.5;
const Q1_X = W / 2 - S_HALF - Q_HALF; // 30
const Q2_X = W / 2 - S_HALF + Q_HALF; // 131
const Q3_X = W / 2 + S_HALF - Q_HALF; // 229
const Q4_X = W / 2 + S_HALF + Q_HALF; // 330
const SL_X = W / 2 - S_HALF; // 80.5
const SR_X = W / 2 + S_HALF; // 279.5
const FC_X = W / 2; // 180

// X centers as % for card positioning
const Q1_PCT = (Q1_X / W) * 100;
const Q2_PCT = (Q2_X / W) * 100;
const Q3_PCT = (Q3_X / W) * 100;
const Q4_PCT = (Q4_X / W) * 100;
const SL_PCT = (SL_X / W) * 100;
const SR_PCT = (SR_X / W) * 100;

// Vertical positions (top edge of each card level)
const YF = 0;
const YS = YF + C + G_FS; // 114
const YQ = YS + C + G_SQ; // 240
const TOTAL_H = YQ + C; // 300

// Connector Y positions
const HF_BOT = YF + C; //  60 – final card bottom
const HB_SEMI = HF_BOT + G_FS / 2; //  87 – semi H-bar
const SB = YS + C; // 174 – semi card bottom
const HB_Q = SB + G_SQ / 2; // 207 – Q H-bar

// ── Rounded connector paths (Figma spec: R≈7.5, cubic bezier k=0.5523) ───────
const R = 7.5;
const K = 0.5523;

const makeU = (lx: number, rx: number, hY: number, cardY: number) =>
  `M${lx} ${cardY}` +
  `V${hY + R}` +
  `C${lx} ${hY + R * (1 - K)} ${lx + R * (1 - K)} ${hY} ${lx + R} ${hY}` +
  `H${rx - R}` +
  `C${rx - R * (1 - K)} ${hY} ${rx} ${hY + R * (1 - K)} ${rx} ${hY + R}` +
  `V${cardY}`;

// draws from fromY upward to toY (toY < fromY)
const makeTrunk = (cx: number, fromY: number, toY: number) => `M${cx} ${fromY}V${toY}`;

type PathDataT = { d: string; delay: string };

const PATHS: PathDataT[] = [
  { d: makeU(Q1_X, Q2_X, HB_Q, YQ), delay: '0.5s' },
  { d: makeU(Q3_X, Q4_X, HB_Q, YQ), delay: '0.5s' },
  { d: makeTrunk(SL_X, HB_Q, SB), delay: '0.8s' },
  { d: makeTrunk(SR_X, HB_Q, SB), delay: '0.8s' },
  { d: makeU(SL_X, SR_X, HB_SEMI, YS), delay: '1.6s' },
  { d: makeTrunk(FC_X, HB_SEMI, HF_BOT), delay: '1.9s' },
];

// ── Bracket data ───────────────────────────────────────────────────────────────
type IconT = 'cap' | 'shirt' | 'pants' | 'bag';
type CardDataT = { xPct: number; top: number; delay: string; icon: IconT; isFinal?: true };

const CARDS: CardDataT[] = [
  { xPct: Q1_PCT, top: YQ, delay: '0s', icon: 'shirt' },
  { xPct: Q2_PCT, top: YQ, delay: '0.07s', icon: 'pants' },
  { xPct: Q3_PCT, top: YQ, delay: '0.14s', icon: 'cap' },
  { xPct: Q4_PCT, top: YQ, delay: '0.21s', icon: 'bag' },
  { xPct: SL_PCT, top: YS, delay: '1.25s', icon: 'shirt' },
  { xPct: SR_PCT, top: YS, delay: '1.35s', icon: 'bag' },
  { xPct: 50, top: YF, delay: '2.35s', icon: 'cap', isFinal: true },
];

// ── Icon map & design sizes ────────────────────────────────────────────────────
const ICON_MAP: Record<IconT, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  cap: FashionCapIcon,
  shirt: FashionShirtIcon,
  pants: FashionPantsIcon,
  bag: FashionBagIcon,
};

const ICON_SIZES: Record<IconT, [number, number]> = {
  cap: [42, 34],
  shirt: [39, 40],
  pants: [29, 38],
  bag: [39, 39],
};

// ── Component ──────────────────────────────────────────────────────────────────
function TournamentBracketAnimation() {
  return (
    <div className="relative w-full" style={{ height: TOTAL_H }}>
      {/* SVG overlay — preserveAspectRatio="none" scales X with container width */}
      <svg
        aria-hidden
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        preserveAspectRatio="none"
        overflow="visible"
        style={{ position: 'absolute', inset: 0, width: '100%', height: TOTAL_H }}
      >
        {PATHS.map((path, i) => (
          <path
            key={i}
            d={path.d}
            fill="none"
            stroke="#E9E9ED"
            strokeWidth={LW}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            className="bk-path"
            style={{ '--bk-d': path.delay } as CSSProperties}
          />
        ))}
      </svg>

      {CARDS.map((card, i) => {
        const Icon = ICON_MAP[card.icon];
        const [iw, ih] = ICON_SIZES[card.icon];
        return (
          <div
            key={i}
            className={card.isFinal ? 'bk-card-final' : 'bk-card'}
            style={
              {
                position: 'absolute',
                left: `calc(${card.xPct}% - ${C / 2}px)`,
                top: card.top,
                width: C,
                height: C,
                '--bk-d': card.delay,
              } as CSSProperties
            }
          >
            <div
              className="flex size-full items-center justify-center rounded-2xl border-[1.85px] border-white bg-gray-50 text-gray-300"
              style={{ boxShadow: '0 0 8px rgba(0,0,0,0.16)' }}
            >
              <Icon width={iw} height={ih} aria-hidden />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TournamentBracketAnimation;
