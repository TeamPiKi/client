'use client';

import { clientApi } from '@/apis/client';
import { captureError } from '@/utils/captureError';

/** ⚠️ 임시 Sentry 검증 페이지 — 수집 확인 후 삭제 (route: /sentry-test) */
function SentryTestPage() {
  /** 1. 클라이언트 uncaught 에러 — 자동 수집 + Session Replay 트리거 확인 */
  const handleThrow = () => {
    throw new Error('Sentry test: 클라이언트 uncaught 에러');
  };

  /** 2. 잡은 에러 수동 캡처 — captureError 유틸/태그 확인 */
  const handleCapture = () => {
    captureError(new Error('Sentry test: handled 에러'), { tags: { source: 'sentry-test' } });
    alert('handled 에러 전송됨');
  };

  /** 3. 5xx API — axios 인터셉터 중앙 수집 확인 */
  const handleApiError = async () => {
    try {
      await clientApi.get('/api/sentry-test-error');
    } catch {
      alert('5xx API 에러 전송됨');
    }
  };

  const buttonClass =
    'w-full max-w-80 cursor-pointer rounded-2xl bg-gray-900 px-5 py-3 text-center font-medium text-white';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
      <h1 className="title-lg">Sentry 테스트</h1>
      <button type="button" onClick={handleThrow} className={buttonClass}>
        1. 클라이언트 에러 throw (Replay 확인)
      </button>
      <button type="button" onClick={handleCapture} className={buttonClass}>
        2. handled 에러 캡처
      </button>
      <button type="button" onClick={handleApiError} className={buttonClass}>
        3. 5xx API 에러
      </button>
    </main>
  );
}

export default SentryTestPage;
