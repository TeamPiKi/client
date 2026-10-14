/** history state 보존하면서 url만 변경 */
export const replaceUrlKeepingState = (url: string) => {
  const { __NA, _N, __PRIVATE_NEXTJS_INTERNALS_TREE, ...customState }: Record<string, unknown> =
    window.history.state ?? {};

  window.history.replaceState(customState, '', url);
};
