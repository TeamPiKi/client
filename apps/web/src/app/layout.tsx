import { GoogleAnalytics } from '@next/third-parties/google';
import { WEBVIEW_UA_TOKEN } from '@piki/core';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import React from 'react';

import BottomTabBar from '@/components/bottom-tab-bar';
import { SCROLL_CONTAINER_ID } from '@/consts/layout';

import Providers from '../components/Providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'PiKi - 같이 고르는 쇼핑 토너먼트',
  description: '흩어진 위시를 한곳에 모아 토너먼트로 결정해보세요.',
};

/**
 * iOS 26 Safari 부터 `<meta name="theme-color">` 가 무시돼 노치/홈 인디케이터 영역이
 * body 배경색을 따른다. 이 영역까지 우리 콘텐츠가 칠해지도록 viewport-fit=cover 를 켜고,
 * 페이지에서는 `pt-padding-top` 으로 패딩을 잡는다.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') ?? '';
  const isWebview = userAgent.includes(WEBVIEW_UA_TOKEN);

  return (
    <html
      lang="ko"
      className="h-full overflow-hidden antialiased"
      {...(isWebview && { 'data-app': '' })}
    >
      <head>
        {/** Pretendard Dynamic Subset CSS */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />

        {process.env.NODE_ENV === 'development' && !isWebview && (
          <>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script
              src="https://unpkg.com/react-grab@0.1.29/dist/index.global.js"
              crossOrigin="anonymous"
            />
            <script
              src="https://unpkg.com/@react-grab/claude-code@0.1.29/dist/client.global.js"
              defer
            />
          </>
        )}
      </head>
      <body className="h-full overflow-hidden">
        <Providers>
          {/** TEMP: max width 임시 값 */}
          <div
            id={SCROLL_CONTAINER_ID}
            className="mx-auto hide-scrollbar h-full max-w-120 overflow-y-auto [scrollbar-gutter:stable]"
          >
            {children}
          </div>

          {/* NOTE: 전환 애니메이션이 끊기지 않게 하기 위해 탭바를 레이아웃에 렌더 */}
          <BottomTabBar />
        </Providers>
        {/**
         * GA4 web stream — 일반 브라우저 사용자 추적용.
         * 웹뷰(앱) 안에서는 native Firebase Analytics 가 따로 작동하므로 이중 집계를 피하려고 마운트 X.
         */}
        {!isWebview && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

export default RootLayout;
