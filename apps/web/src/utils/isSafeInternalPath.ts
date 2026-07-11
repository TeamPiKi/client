/** 동일 오리진 내부 경로인지 검증 (`//`, `/\` 등 외부 리다이렉트 방지) */
const isSafeInternalPath = (path: unknown): path is string => {
  if (typeof path !== 'string' || !path.startsWith('/')) return false;
  return !path.startsWith('//') && !path.startsWith('/\\');
};

export default isSafeInternalPath;
