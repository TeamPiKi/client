import { ERROR_CODE } from '@piki/core';
import type { ApiErrorCodeT } from '@piki/core';

export const MAX_FOLDER_WISH_SELECT_COUNT = 100;

export const FOLDER_NAME_ERROR_CODES: readonly (ApiErrorCodeT | null)[] = [
  ERROR_CODE.FOLDER_DUPLICATE_NAME,
  ERROR_CODE.FOLDER_INVALID_NAME,
];
