const isPowerOfTwo = (n: number) => n >= 2 && (n & (n - 1)) === 0;

/** 후보 수가 2의 거듭제곱이 아니면 일부가 자동으로 다음 라운드에 올라간다 */
export const needsByeWarning = (itemCount: number) => !isPowerOfTwo(itemCount);
