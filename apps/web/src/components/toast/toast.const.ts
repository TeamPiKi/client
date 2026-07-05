/**
 * 토스트 하단 offset.
 * sonner의 `offset` prop은 데스크탑/모바일 둘 다 동일하게 적용되어,
 * `mobileOffset`과 별개로 컨테이너 기본 위치를 제어한다.
 */
export const TOAST_OFFSET = {
  /** 하단 in-flow 버튼 영역(~88px) 기준 기본값 */
  DEFAULT: '95px',
  /** Bottom Tab Bar(bottom 40px + pill ~68px) + 여백 12px */
  ABOVE_TAB_BAR: '115px',
} as const;
