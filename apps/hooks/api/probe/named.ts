/** 진단용 — 이름 붙은 메서드 export + import 없음 */
export async function GET() {
  return Response.json({ probe: 'named', ok: true });
}
