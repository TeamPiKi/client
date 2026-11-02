export const FOLDER_RESULT = {
  ADDED: 'ADDED',
  ALREADY_IN_FOLDER: 'ALREADY_IN_FOLDER',
} as const;

export const FOLDER_RESULT_MESSAGE = {
  [FOLDER_RESULT.ADDED]: '이미 담은 상품을 폴더에 추가했어요.',
  [FOLDER_RESULT.ALREADY_IN_FOLDER]: '이미 이 폴더에 있는 상품이에요.',
} as const;
