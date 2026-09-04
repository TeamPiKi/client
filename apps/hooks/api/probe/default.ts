/** 진단용 — default export 핸들러 + import 없음 */
export default async function handler() {
  return Response.json({ probe: 'default', ok: true });
}
