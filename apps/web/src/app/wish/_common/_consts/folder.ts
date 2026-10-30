import { ERROR_CODE } from '@piki/core';
import type { ApiErrorCodeT } from '@piki/core';

export const FOLDER_NAME_ERROR_CODES: readonly (ApiErrorCodeT | null)[] = [
  ERROR_CODE.FOLDER_DUPLICATE_NAME,
  ERROR_CODE.FOLDER_INVALID_NAME,
];
