import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES, MOCK_WISH_ADDED_BY_LINK } from '@e2e/mocks/wish';

const MOCK_UPLOAD_URL_PREFIX = 'https://s3.example/e2e/wish-upload/';

/** 브라우저 <img> 가 바로 디코드할 수 있는 원본 — 크롭 화면 진입 검증용 */
const createPickedSvg = (color: string) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480">' +
  `<rect width="320" height="480" fill="${color}"/>` +
  '</svg>';

const PICKED_FILES = [
  { name: 'first.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(createPickedSvg('#34d399')) },
  {
    name: 'second.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from(createPickedSvg('#60a5fa')),
  },
];

/** JPEG SOF 마커에서 출력 크기를 읽는다 — 크롭이 실제로 적용됐는지 검증용 */
const getJpegSize = (buffer: Buffer) => {
  for (let index = 2; index < buffer.length - 9; index += 1) {
    if (buffer[index] !== 0xff) continue;
    const marker = buffer[index + 1];
    if (marker === 0xc0 || marker === 0xc2)
      return { height: buffer.readUInt16BE(index + 5), width: buffer.readUInt16BE(index + 7) };
  }
  return null;
};

const openImageDialog = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto('/archive/wish');
  await page.getByRole('button', { name: '아이템 추가하기' }).click();
  await expect(page.getByRole('dialog', { name: '위시 담기' })).toBeVisible();
  await page.getByRole('button', { name: /이미지로 담기/ }).click();
  await expect(page.getByRole('dialog', { name: '이미지로 담기' })).toBeVisible();
};

test('여러 장을 고르면 에디터가 열리고, 편집한 장만 JPEG 로 바뀌어 업로드된다', async ({
  page,
  api,
}) => {
  await openImageDialog(page, api);

  await page.locator('input[type="file"]').setInputFiles(PICKED_FILES);

  const editor = page.getByRole('dialog', { name: '이미지 편집' });
  await expect(editor).toBeVisible();
  await expect(editor.getByRole('button', { name: '1번째 사진 편집' })).toHaveAttribute(
    'aria-current',
    'true'
  );

  /** 첫 장만 크롭 — 손대지 않은 둘째 장은 원본 그대로 가야 한다 */
  await expect(editor.getByRole('button', { name: '완료' })).toBeEnabled();
  const handleBox = await editor.locator('.cropper-point.point-se').boundingBox();
  if (!handleBox) throw new Error('crop handle not found');
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x - 80, handleBox.y - 120, { steps: 10 });
  await page.mouse.up();
  const croppedBox = await editor.locator('.cropper-crop-box').boundingBox();

  /** 하단 썸네일로 장 이동 */
  await editor.getByRole('button', { name: '2번째 사진 편집' }).click();
  await expect(editor.getByRole('button', { name: '2번째 사진 편집' })).toHaveAttribute(
    'aria-current',
    'true'
  );
  await expect(editor.getByRole('button', { name: '완료' })).toBeEnabled();

  /** 첫 장으로 돌아와도 크롭한 영역이 그대로 남아 있어야 한다 */
  await editor.getByRole('button', { name: '1번째 사진 편집' }).click();
  await expect(editor.getByRole('button', { name: '완료' })).toBeEnabled();
  await expect
    .poll(async () => (await editor.locator('.cropper-crop-box').boundingBox())?.width)
    .toBeCloseTo(croppedBox?.width ?? 0, 0);

  api.post(ENDPOINTS.WISH_IMAGE_PRESIGNED, {
    uploads: [
      { imageKey: 'key-1', uploadUrl: `${MOCK_UPLOAD_URL_PREFIX}1`, contentType: 'image/jpeg' },
      { imageKey: 'key-2', uploadUrl: `${MOCK_UPLOAD_URL_PREFIX}2`, contentType: 'image/svg+xml' },
    ],
  });
  api.post(ENDPOINTS.WISH_IMAGE_CONFIRM, [
    { ...MOCK_WISH_ADDED_BY_LINK, refreshNeeded: null, reused: null },
  ]);

  const putBodies: Record<string, { contentType?: string; body?: Buffer | null }> = {};
  await page.route(`${MOCK_UPLOAD_URL_PREFIX}*`, async route => {
    putBodies[route.request().url()] = {
      contentType: route.request().headers()['content-type'],
      body: route.request().postDataBuffer(),
    };
    await route.fulfill({ status: 200, body: '' });
  });

  const presignRequestPromise = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      new URL(request.url()).pathname === ENDPOINTS.WISH_IMAGE_PRESIGNED
  );
  const confirmRequestPromise = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      new URL(request.url()).pathname === ENDPOINTS.WISH_IMAGE_CONFIRM
  );

  await editor.getByRole('button', { name: '완료' }).click();

  const presignBody = (await presignRequestPromise).postDataJSON() as {
    images: { contentType: string }[];
  };
  expect(presignBody.images.map(image => image.contentType)).toEqual([
    'image/jpeg',
    'image/svg+xml',
  ]);

  expect((await confirmRequestPromise).postDataJSON()).toEqual({ imageKeys: ['key-1', 'key-2'] });

  /** 크롭한 첫 장은 320x480 원본보다 작은 JPEG, 둘째 장은 원본 SVG 바이트 그대로 */
  const firstPut = putBodies[`${MOCK_UPLOAD_URL_PREFIX}1`];
  expect(firstPut?.contentType).toBe('image/jpeg');
  expect(firstPut?.body?.subarray(0, 3).toString('hex')).toBe('ffd8ff');
  const firstSize = firstPut?.body && getJpegSize(firstPut.body);
  expect(firstSize?.width).toBeLessThan(320);
  expect(firstSize?.height).toBeLessThan(480);

  const secondPut = putBodies[`${MOCK_UPLOAD_URL_PREFIX}2`];
  expect(secondPut?.contentType).toBe('image/svg+xml');
  expect(secondPut?.body?.toString()).toBe(PICKED_FILES[1]?.buffer.toString());

  await expect(editor).toBeHidden();
  await expect(page.getByRole('dialog', { name: '이미지로 담기' })).toBeHidden();
});

test('크롭 박스 모서리를 끌어 줄이면 그 영역만 JPEG 로 업로드된다', async ({ page, api }) => {
  await openImageDialog(page, api);
  await page.locator('input[type="file"]').setInputFiles(PICKED_FILES[0] ?? []);

  const editor = page.getByRole('dialog', { name: '이미지 편집' });
  await expect(editor.getByRole('button', { name: '완료' })).toBeEnabled();

  /** 오른쪽 아래 핸들을 안쪽으로 끌어 크롭 박스를 절반 가까이 줄인다 */
  const handle = editor.locator('.cropper-point.point-se');
  const handleBox = await handle.boundingBox();
  if (!handleBox) throw new Error('crop handle not found');
  const startX = handleBox.x + handleBox.width / 2;
  const startY = handleBox.y + handleBox.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 80, startY - 120, { steps: 10 });
  await page.mouse.up();

  api.post(ENDPOINTS.WISH_IMAGE_PRESIGNED, {
    uploads: [
      { imageKey: 'key-1', uploadUrl: `${MOCK_UPLOAD_URL_PREFIX}1`, contentType: 'image/jpeg' },
    ],
  });
  api.post(ENDPOINTS.WISH_IMAGE_CONFIRM, [
    { ...MOCK_WISH_ADDED_BY_LINK, refreshNeeded: null, reused: null },
  ]);

  let putBody: Buffer | null | undefined;
  await page.route(`${MOCK_UPLOAD_URL_PREFIX}*`, async route => {
    putBody = route.request().postDataBuffer();
    await route.fulfill({ status: 200, body: '' });
  });
  const confirmRequestPromise = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      new URL(request.url()).pathname === ENDPOINTS.WISH_IMAGE_CONFIRM
  );

  await editor.getByRole('button', { name: '완료' }).click();
  await confirmRequestPromise;

  const size = putBody && getJpegSize(putBody);
  expect(size).not.toBeNull();
  /** 원본 320x480 보다 양쪽 다 작아야 자유 비율 크롭이 실제로 반영된 것 */
  expect(size?.width).toBeLessThan(320);
  expect(size?.height).toBeLessThan(480);
  await expect(editor).toBeHidden();
});

test('에디터에서 뒤로 가면 업로드 없이 이미지 선택 다이얼로그로 돌아온다', async ({
  page,
  api,
}) => {
  await openImageDialog(page, api);
  await page.locator('input[type="file"]').setInputFiles(PICKED_FILES);

  const editor = page.getByRole('dialog', { name: '이미지 편집' });
  await expect(editor).toBeVisible();

  let presignCallCount = 0;
  await page.route(`**${ENDPOINTS.WISH_IMAGE_PRESIGNED}`, async route => {
    presignCallCount += 1;
    await route.abort();
  });

  await editor.getByRole('button', { name: '뒤로가기' }).click();

  await expect(editor).toBeHidden();
  await expect(page.getByRole('dialog', { name: '이미지로 담기' })).toBeVisible();
  expect(presignCallCount).toBe(0);
});

test('브라우저가 디코드하지 못하는 이미지는 편집 불가 안내 후 원본 그대로 업로드한다', async ({
  page,
  api,
}) => {
  await openImageDialog(page, api);
  await page.locator('input[type="file"]').setInputFiles({
    name: 'photo.heic',
    mimeType: 'image/heic',
    buffer: Buffer.from('not-an-image'),
  });

  const editor = page.getByRole('dialog', { name: '이미지 편집' });
  await expect(editor).toBeVisible();
  await expect(editor.getByText('이 이미지는 편집할 수 없어요.')).toBeVisible();

  api.post(ENDPOINTS.WISH_IMAGE_PRESIGNED, {
    uploads: [
      { imageKey: 'key-1', uploadUrl: `${MOCK_UPLOAD_URL_PREFIX}1`, contentType: 'image/heic' },
    ],
  });
  api.post(ENDPOINTS.WISH_IMAGE_CONFIRM, [
    { ...MOCK_WISH_ADDED_BY_LINK, refreshNeeded: null, reused: null },
  ]);
  await page.route(`${MOCK_UPLOAD_URL_PREFIX}*`, route => route.fulfill({ status: 200, body: '' }));

  const presignRequestPromise = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      new URL(request.url()).pathname === ENDPOINTS.WISH_IMAGE_PRESIGNED
  );

  await editor.getByRole('button', { name: '완료' }).click();

  const presignBody = (await presignRequestPromise).postDataJSON() as {
    images: { contentType: string }[];
  };
  expect(presignBody.images.map(image => image.contentType)).toEqual(['image/heic']);
  await expect(editor).toBeHidden();
});
