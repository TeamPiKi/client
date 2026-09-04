import { verifySignature } from '../../lib/verify.js';

/** 진단용 — 확장자 없는 상대 import 가 런타임에 해석되는지 */
export async function GET() {
  return Response.json({ probe: 'imported', ok: typeof verifySignature === 'function' });
}
