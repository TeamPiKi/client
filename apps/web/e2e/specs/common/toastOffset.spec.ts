import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST } from '@e2e/mocks/tournament';

const OFFSET = {
  NONE: '',
  TAB_BAR: '102px',
  CTA: '110px',
  CTA_TALL: '150px',
} as const;

type ProbeT = 'none' | 'default' | 'tall';

const readToastOffset = (page: Page, cta: ProbeT) =>
  page.evaluate(ctaHeight => {
    document.getElementById('probe-cta')?.remove();

    if (ctaHeight !== 'none') {
      const probeCta = document.createElement('div');
      probeCta.id = 'probe-cta';
      probeCta.setAttribute('data-bottom-cta', ctaHeight);
      document.body.appendChild(probeCta);
    }

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
  }, cta);

test('탭바 페이지에서는 토스트가 탭바 위로 올라간다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');
  await expect(page.locator('[data-bottom-tab-bar]')).toBeVisible();

  expect(await readToastOffset(page, 'none')).toEqual({
    offsetBottom: OFFSET.TAB_BAR,
    mobileOffsetBottom: OFFSET.TAB_BAR,
  });
});

test('하단 CTA 가 있으면 CTA 높이 기준으로 올라가고, 탭바 규칙보다 우선한다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  // 탭바가 있는 페이지에서 확인 — 위시 삭제 모드처럼 CTA 가 탭바를 덮는 케이스와 같은 조건
  await page.goto('/home');
  await expect(page.locator('[data-bottom-tab-bar]')).toBeVisible();

  expect(await readToastOffset(page, 'default')).toEqual({
    offsetBottom: OFFSET.CTA,
    mobileOffsetBottom: OFFSET.CTA,
  });

  expect(await readToastOffset(page, 'tall')).toEqual({
    offsetBottom: OFFSET.CTA_TALL,
    mobileOffsetBottom: OFFSET.CTA_TALL,
  });
});

test('하단 바가 없는 페이지에는 덮어쓰기 규칙이 걸리지 않는다', async ({ page }) => {
  await page.goto('/not-found-page-for-toast-offset');
  await expect(page.locator('[data-bottom-tab-bar]')).toHaveCount(0);

  expect(await readToastOffset(page, 'none')).toEqual({
    offsetBottom: OFFSET.NONE,
    mobileOffsetBottom: OFFSET.NONE,
  });
});
