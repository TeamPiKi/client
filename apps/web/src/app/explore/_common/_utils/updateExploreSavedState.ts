type SavedStateT = {
  isInMyWish: boolean;
  savedWishId: number | null;
};

type NodeT = Record<string, unknown>;

const isNode = (value: unknown): value is NodeT => typeof value === 'object' && value !== null;

/**
 * 탐색 캐시 안에서 담김 상태를 가진 카드·상세를 모두 찾아 바꿈.
 * 피드·전체보기·상세·후보 목록·폴더 캐시의 모양이 제각각이라 `isInMyWish` 를 가진 객체를 기준으로 순회함
 */
export const updateExploreSavedState = (
  data: unknown,
  isTarget: (node: NodeT) => boolean,
  nextState: SavedStateT
): unknown => {
  if (Array.isArray(data))
    return data.map(item => updateExploreSavedState(item, isTarget, nextState));
  if (!isNode(data)) return data;

  const node = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      updateExploreSavedState(value, isTarget, nextState),
    ])
  );

  return 'isInMyWish' in node && isTarget(node) ? { ...node, ...nextState } : node;
};
