export const REPORT_REASONS = [
  { value: 'SPAM_OR_AD', label: '스팸·광고성 콘텐츠' },
  { value: 'INAPPROPRIATE_ITEM_OR_IMAGE', label: '부적절한 상품·이미지' },
  { value: 'SEXUAL_CONTENT', label: '음란하거나 선정적인 콘텐츠' },
  { value: 'ABUSIVE_OR_HATE_SPEECH', label: '욕설·혐오 표현' },
  { value: 'IMPERSONATION', label: '다른 사람 사칭' },
  { value: 'OTHER', label: '기타' },
] as const;
