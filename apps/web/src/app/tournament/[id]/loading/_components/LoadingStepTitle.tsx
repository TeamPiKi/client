import '../_styles/LoadingStep.css';
import type { LoadingStepT } from '../_types/loadingStep';

const STEP_TITLE: Record<LoadingStepT, string> = {
  1: '상품을 불러오고 있어요',
  2: '이제 거의 다왔어요',
  3: '토너먼트 준비 완료!',
};

type LoadingStepTitleProps = {
  step: LoadingStepT;
};

function LoadingStepTitle({ step }: LoadingStepTitleProps) {
  return (
    <h1 key={step} className="ls-title text-center title-1 text-[22px] text-gray-900">
      {STEP_TITLE[step]}
      {step === 1 && (
        <span aria-hidden>
          <span className="ls-dot">.</span>
          <span className="ls-dot">.</span>
          <span className="ls-dot">.</span>
        </span>
      )}
    </h1>
  );
}

export default LoadingStepTitle;
