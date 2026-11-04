export type TransitionStageT = 'toFinal' | 'toSemi' | 'toNext';

// 다음 라운드에 진출하는 아이템 수에 따라 어떤 전환 화면을 보여줄지 결정
// 2 → 결승 진입, 4 → 준결승 진입, 그 외 → 일반 다음 라운드
export const getTransitionStage = (nextRoundItemCount: number): TransitionStageT => {
  if (nextRoundItemCount === 2) return 'toFinal';
  if (nextRoundItemCount > 2 && nextRoundItemCount <= 4) return 'toSemi';
  return 'toNext';
};
