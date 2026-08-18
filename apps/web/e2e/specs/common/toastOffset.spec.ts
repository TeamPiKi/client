import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_PENDING,
} from '@e2e/mocks/tournament';

const OFFSET = {
  NONE: '',
  TAB_BAR: '102px',
  CTA: '110px',
  CTA_TALL: '150px',
} as const;

const readToastOffset = (page: Page) =>
  page.evaluate(() => {
    let toaster = document.getElementById('probe-toaster');
    if (!toaster) {
      toaster = document.createElement('div');
      toaster.id = 'probe-toaster';
      toaster.setAttribute('data-sonner-toaster', '');
      toaster.setAttribute('data-y-position', 'bottom');
      document.body.appendChild(toaster);
    }

    const style = getComputedStyle(toaster);
    return {
      offsetBottom: style.getPropertyValue('--offset-bottom').trim(),
      mobileOffsetBottom: style.getPropertyValue('--mobile-offset-bottom').trim(),
    };
  });

test('탭바 페이지에서는 토스트가 탭바 위로 올라간다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');
  await expect(page.locator('[data-bottom-tab-bar]')).toBeVisible();

  expect(await readToastOffset(page)).toEqual({
    offsetBottom: OFFSET.TAB_BAR,
    mobileOffsetBottom: OFFSET.TAB_BAR,
  });
});

test('기본형 CTA 페이지(담기 화면)에서는 토스트가 CTA 위로 올라간다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);

  await page.goto('/tournament/1/create');
  await expect(page.locator('[data-bottom-cta="default"]')).toBeVisible();

  expect(await readToastOffset(page)).toEqual({
    offsetBottom: OFFSET.CTA,
    mobileOffsetBottom: OFFSET.CTA,
  });
});

test('tall CTA 페이지(결과 화면)에서는 토스트가 그만큼 더 올라간다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

  await page.goto('/tournament/3/result');
  await expect(page.locator('[data-bottom-cta="tall"]')).toBeVisible();

  expect(await readToastOffset(page)).toEqual({
    offsetBottom: OFFSET.CTA_TALL,
    mobileOffsetBottom: OFFSET.CTA_TALL,
  });
});

test('CTA 와 탭바 마커가 함께 있으면 CTA 규칙이 이긴다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');
  await expect(page.locator('[data-bottom-tab-bar]')).toBeVisible();

  await page.evaluate(() => {
    const cta = document.createElement('div');
    cta.setAttribute('data-bottom-cta', 'default');
    document.body.appendChild(cta);
  });

  expect(await readToastOffset(page)).toEqual({
    offsetBottom: OFFSET.CTA,
    mobileOffsetBottom: OFFSET.CTA,
  });
});

test('하단 바가 없는 페이지에는 덮어쓰기 규칙이 걸리지 않는다', async ({ page }) => {
  await page.goto('/not-found-page-for-toast-offset');
  await expect(page.locator('[data-bottom-tab-bar]')).toHaveCount(0);
  await expect(page.locator('[data-bottom-cta]')).toHaveCount(0);

  expect(await readToastOffset(page)).toEqual({
    offsetBottom: OFFSET.NONE,
    mobileOffsetBottom: OFFSET.NONE,
  });
});
