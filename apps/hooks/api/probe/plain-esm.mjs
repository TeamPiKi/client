/** 진단용 대조군 — TS 컴파일 없이 순수 ESM */
export default function handler(_req, res) {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ probe: 'esm' }));
}
