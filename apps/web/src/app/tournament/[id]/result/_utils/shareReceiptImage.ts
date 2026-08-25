import { toBlob } from 'html-to-image';

const FILE_NAME = 'piki-receipt.png';
const MIME = 'image/png';

/** 공유 이미지 가로 폭 (디자인 스펙) — 캡처 대상 실제 폭에 맞춰 pixelRatio 를 역산한다 */
export const SHARE_IMAGE_WIDTH = 1080;

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
    // 상품 이미지는 /_next/image?url=... 로 쿼리에만 차이가 있다. 기본 캐시 키는 쿼리를 잘라내
    // 모든 상품이 첫 번째 이미지로 그려지므로 쿼리까지 키에 포함시킨다.
    includeQueryParams: true,
    // mode 를 지정하지 않는다 — 상품 이미지는 /_next/image 프록시라 same-origin 이고,
    // 'cors' 로 보내면 CORS 헤더가 없는 프록시 응답이 거부돼 캐시 미스일 때만 사진이 빠진다.
    fetchRequestInit: { cache: 'force-cache' },
  });
  if (!blob) throw new Error('영수증 이미지 변환 실패');

  return blob;
};

/**
 * 공유 시트가 이미 떠 있는데 navigator.share() 를 다시 부르면 나는 에러.
 * 브라우저마다 이름이 갈린다 — Chrome 계열은 InvalidStateError, Safari 는 NotAllowedError.
 */
const CONCURRENT_SHARE_ERROR_NAMES = ['InvalidStateError', 'NotAllowedError'];

/**
 * 캡처된 blob 을 시스템 공유 시트로 전달 (카톡 등 앱 선택은 사용자 몫).
 *
 * @returns 'shared' 공유 완료 · 'cancelled' 사용자가 시트를 닫음 ·
 *          'busy' 이미 공유 진행 중 · 'unsupported' 파일 공유 미지원
 */
export const shareReceiptImageFile = async (
  blob: Blob
): Promise<'shared' | 'cancelled' | 'busy' | 'unsupported'> => {
  const file = new File([blob], FILE_NAME, { type: MIME });

  if (typeof navigator?.canShare !== 'function' || !navigator.canShare({ files: [file] })) {
    return 'unsupported';
  }

  try {
    await navigator.share({ files: [file] });
    return 'shared';
  } catch (error) {
    if (!(error instanceof DOMException)) return 'unsupported';
    if (error.name === 'AbortError') return 'cancelled';
    // 연타로 인한 중복 호출까지 미지원으로 뭉뚱그리면 엉뚱한 안내가 나간다.
    if (CONCURRENT_SHARE_ERROR_NAMES.includes(error.name)) return 'busy';
    return 'unsupported';
  }
};
