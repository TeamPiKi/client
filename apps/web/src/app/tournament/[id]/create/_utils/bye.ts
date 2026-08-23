/**
 * 후보 수가 2의 거듭제곱(2, 4, 8, 16, 32)이면 부전승 없이 진행된다.
 * 그 외에는 일부 후보가 자동으로 다음 라운드에 올라가므로 시작 전에 안내한다.
 */
export const isPowerOfTwo = (n: number) => n >= 2 && (n & (n - 1)) === 0;

/** 시작 전 부전승 안내가 필요한지 */
export const needsByeWarning = (itemCount: number) => !isPowerOfTwo(itemCount);
