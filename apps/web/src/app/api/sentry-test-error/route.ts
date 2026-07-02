import { NextResponse } from 'next/server';

/** ⚠️ 임시 Sentry 검증용 의도적 500 — 수집 확인 후 삭제 */
export function GET() {
  return NextResponse.json(
    {
      status: 500,
      data: null,
      detail: 'Sentry 테스트용 의도적 서버 오류',
      code: 'SENTRY_TEST_ERROR',
    },
    { status: 500 }
  );
}
