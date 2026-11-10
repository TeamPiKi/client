import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/utils/cn';

import BagIcon from '../_assets/bag.svg';
import CapIcon from '../_assets/cap.svg';
import CheckIcon from '../_assets/check.svg';
import ShirtIcon from '../_assets/shirt.svg';
import '../_styles/LoadingStep.css';
import type { LoadingStepT } from '../_types/loadingStep';

type LoadingStepCardProps = {
  step: LoadingStepT;
  barProgress: number;
};

type StepIconT = {
  step: LoadingStepT;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  positionClassName: string;
  motionClassName: string;
  checkLeft: number;
  checkTop: number;
};

const STEP_ICONS: StepIconT[] = [
  {
    step: 1,
    Icon: ShirtIcon,
    positionClassName: 'top-[12.65px] left-5',
    motionClassName: 'ls-shirt',
    checkLeft: 7.71,
    checkTop: 8.14,
  },
  {
    step: 2,
    Icon: CapIcon,
    positionClassName: 'top-[13.68px] left-1/2 -translate-x-1/2',
    motionClassName: 'ls-cap',
    checkLeft: 9.63,
    checkTop: 7.12,
  },
  {
    step: 3,
    Icon: BagIcon,
    positionClassName: 'top-[12.76px] right-5',
    motionClassName: 'ls-bag',
    checkLeft: 9.75,
    checkTop: 9.14,
  },
];

const BAR_GRADIENT: Record<LoadingStepT, string> = {
  1: 'from-sky-blue-300 to-transparent',
  2: 'from-[#a2deff] from-[7.3%] via-[#8cd6fe] via-[48.3%] to-transparent',
  3: 'from-[#a2deff] from-[7.3%] via-[#8cd6fe] via-[48.3%] to-sky-blue-300 to-[91.9%]',
};

function LoadingStepCard({ step, barProgress }: LoadingStepCardProps) {
  return (
    <div className="relative h-[61px] w-full overflow-hidden rounded-[30px] bg-white">
      <div className="absolute top-[26px] right-[41px] left-[29px] h-2 rounded-[30px] bg-sky-blue-50 opacity-50" />
      <div
        className={cn(
          'absolute top-[26px] left-[49px] h-2 rounded-r-[30px] bg-linear-to-r transition-[width] duration-300 ease-out',
          BAR_GRADIENT[step]
        )}
        style={{ width: `calc((100% - 82px) * ${barProgress})` }}
      />

      {STEP_ICONS.map(
        ({ step: iconStep, Icon, positionClassName, motionClassName, checkLeft, checkTop }) => {
          const isActive = step >= iconStep;
          return (
            <div key={iconStep} className={cn('absolute', positionClassName)}>
              <div className={cn('relative', isActive && motionClassName)}>
                <Icon
                  aria-hidden
                  className={cn(
                    'transition-colors duration-[180ms]',
                    isActive ? 'text-sky-blue-300' : 'text-gray-50'
                  )}
                />
                {isActive && (
                  <CheckIcon
                    aria-hidden
                    className="ls-check absolute"
                    style={{ left: checkLeft, top: checkTop }}
                  />
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default LoadingStepCard;
