/* eslint-disable no-undef -- 진단용 임시 파일 */
/** 진단용 대조군 — TS 컴파일 없이 CommonJS */
module.exports = (_req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ probe: 'cjs' }));
};
