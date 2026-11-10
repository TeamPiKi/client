import { useEffect, useRef, useState } from 'react';

import type { LoadingStepT } from '../_types/loadingStep';

const PROGRESS_TICK_MS = 100;

const STEP_2_PROGRESS = 0.5;
const STEP_2_MAX_PROGRESS = 0.95;

const STEP_MOTION_MS: Record<LoadingStepT, number> = {
  1: 600,
  2: 720,
  3: 1440,
};

const DONE_HOLD_MS = 800;

type UseLoadingStepParams = {
  progress: number;
  isComplete: boolean;
  onDone: () => void;
};

const getBarProgress = (step: LoadingStepT, progress: number) => {
  if (step === 1) return Math.min(progress, STEP_2_PROGRESS);
  if (step === 2) return Math.min(Math.max(progress, STEP_2_PROGRESS), STEP_2_MAX_PROGRESS);
  return 1;
};

const useLoadingStep = ({ progress, isComplete, onDone }: UseLoadingStepParams) => {
  const [step, setStep] = useState<LoadingStepT>(1);
  const stepStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (step === 3) return;

    const interval = window.setInterval(() => {
      const now = performance.now();
      stepStartedAtRef.current ??= now;

      if (now - stepStartedAtRef.current < STEP_MOTION_MS[step]) return;

      const shouldAdvance = step === 1 ? progress >= STEP_2_PROGRESS || isComplete : isComplete;
      if (!shouldAdvance) return;

      stepStartedAtRef.current = now;
      setStep(step === 1 ? 2 : 3);
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(interval);
  }, [step, progress, isComplete]);

  useEffect(() => {
    if (step !== 3) return;
    const timer = window.setTimeout(onDone, STEP_MOTION_MS[3] + DONE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [step, onDone]);

  return { step, barProgress: getBarProgress(step, progress) };
};

export default useLoadingStep;
