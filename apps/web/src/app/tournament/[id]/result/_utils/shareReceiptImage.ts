import { toBlob } from 'html-to-image';

const FILE_NAME = 'piki-receipt.png';
const MIME = 'image/png';

/** 공유 이미지 가로 폭 (디자인 스펙) — 캡처 대상 실제 폭에 맞춰 pixelRatio 를 역산한다 */
export const SHARE_IMAGE_WIDTH = 1080;

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(
      value => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      error => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

/** 폰트(Kode Mono)·이미지가 모두 로드된 뒤 캡처해야 변형 없이 동일하게 나온다 */
const waitForAssets = async (element: HTMLElement) => {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await withTimeout(document.fonts.ready, 3_000).catch(() => null);
  }

  await Promise.all(
    [...element.querySelectorAll('img')].map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return withTimeout(
        new Promise(resolve => {
          img.addEventListener('load', () => resolve(null), { once: true });
          img.addEventListener('error', () => resolve(null), { once: true });
        }),
        3_000
      ).catch(() => null);
    })
  );
};

/**
 * 영수증 DOM 을 PNG blob 으로 캡처한다.
 *
 * `html-to-image` 사용 — `html2canvas` 가 Tailwind v4 의 `lab()`/`oklch()` 컬러를 파싱하지 못해
 * 모던 CSS 컬러 스페이스를 지원하는 라이브러리로 교체.
 *
 * 결과 폭은 항상 SHARE_IMAGE_WIDTH 로 고정 — 기기 dpr 과 무관하게 동일한 이미지가 나온다.
 */
export const captureReceiptImage = async (element: HTMLElement): Promise<Blob> => {
  await waitForAssets(element);

  const elementWidth = element.offsetWidth || SHARE_IMAGE_WIDTH;
  const pixelRatio = SHARE_IMAGE_WIDTH / elementWidth;

  const blob = await toBlob(element, {
    pixelRatio,
    // cacheBust:true 는 URL 에 query 를 붙여 새 요청을 만드는데, S3 가 CORS 헤더를 일관되게
    // 안 주면 preflight 가 매번 일어나 차단 위험이 커진다. 브라우저 캐시를 활용해 CORS 검증을 줄인다.
    cacheBust: false,
    fetchRequestInit: { cache: 'force-cache', mode: 'cors' },
  });
  if (!blob) throw new Error('영수증 이미지 변환 실패');

  return blob;
};

/** 캡처된 blob 을 파일로 저장 */
export const saveReceiptImage = (blob: Blob) => {
  downloadBlob(blob, FILE_NAME);
};

/**
 * 캡처된 blob 을 클립보드에 복사.
 * ClipboardItem 미지원(안드로이드 웹뷰 등) 이면 false 를 반환해 호출부가 대체 동작을 고른다.
 */
export const copyReceiptImage = async (blob: Blob): Promise<boolean> => {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false;

  try {
    await navigator.clipboard.write([new ClipboardItem({ [MIME]: blob })]);
    return true;
  } catch {
    return false;
  }
};

/**
 * 캡처된 blob 을 시스템 공유 시트로 전달 (카톡 등 앱 선택은 사용자 몫).
 *
 * @returns 'shared' 공유 완료 · 'cancelled' 사용자가 시트를 닫음 · 'unsupported' 파일 공유 미지원
 */
export const shareReceiptImageFile = async (
  blob: Blob
): Promise<'shared' | 'cancelled' | 'unsupported'> => {
  const file = new File([blob], FILE_NAME, { type: MIME });

  if (typeof navigator?.canShare !== 'function' || !navigator.canShare({ files: [file] })) {
    return 'unsupported';
  }

  try {
    await navigator.share({ files: [file] });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    return 'unsupported';
  }
};
