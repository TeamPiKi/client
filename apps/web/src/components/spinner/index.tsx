import type { CSSProperties } from 'react';

import './Spinner.css';
import type { SpinnerProps } from './spinner.type';

const VIEWBOX_SIZE = 24;
const CENTER = VIEWBOX_SIZE / 2;
const SEGMENT_COUNT = 8;

const SEGMENT = {
  x: CENTER - 1,
  y: 2,
  width: 2,
  height: 5,
  rx: 1,
};

const SEGMENTS = Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
  rotation: (360 / SEGMENT_COUNT) * i,
  delayFactor: SEGMENT_COUNT - i,
}));

function Spinner({ size = 30, timing = 1, color }: SpinnerProps) {
  const delayStep = timing / SEGMENT_COUNT;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      style={{ '--spinner-timing': `${timing}s`, '--spinner-color': color } as CSSProperties}
    >
      {SEGMENTS.map(({ rotation, delayFactor }, i) => (
        <rect
          key={i}
          className="spinner-segment"
          {...SEGMENT}
          transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
          style={{ animationDelay: `${-delayStep * delayFactor}s` }}
        />
      ))}
    </svg>
  );
}

export default Spinner;
