import type { IncomingMessage, ServerResponse } from 'node:http';

/** 진단용 — 클래식 Node 시그니처 + 웹 전역 미사용, 런타임 버전 보고 */
export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify({
      node: process.version,
      typeofResponse: typeof Response,
      typeofFetch: typeof fetch,
    })
  );
}
