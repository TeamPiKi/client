import { withSentryConfig } from '@sentry/nextjs';

import { getWebVersion } from './config/getWebVersion.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  const webVersion = await getWebVersion();

  return {
    env: {
      NEXT_PUBLIC_WEB_VERSION: webVersion ?? '',
    },
    turbopack: {
      rules: {
        '*.svg': {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          /** NOTE: SVG id 축약 방지 */
                          cleanupIds: { minify: false },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: '*.js',
        },
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '*.kakaocdn.net',
        },
      ],
    },

    /** NOTE: 구버전 앱·기존 링크 사라지면 이 설정 제거 필요 */
    async redirects() {
      return [
        /** 구버전 초대 링크 에러 핸들링 경로 호환*/
        {
          source: '/invite/:id',
          destination: '/tournament/join/:id',
          permanent: false,
        },
        /** 구버전 앱 공유 시트·기존 딥링크의 /archive(?tab=) 경로 호환 */
        {
          source: '/archive',
          has: [{ type: 'query', key: 'tab', value: 'tournament' }],
          destination: '/archive/tournament',
          permanent: false,
        },
        {
          source: '/archive',
          destination: '/archive/wish',
          permanent: false,
        },
      ];
    },

    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
        },
      ];
    },

    /** iOS Universal Link, Android App Link 검증 파일은 application/json으로 확장자 지정 */
    async headers() {
      return [
        {
          source: '/.well-known/apple-app-site-association',
          headers: [{ key: 'Content-Type', value: 'application/json' }],
        },
        {
          source: '/.well-known/assetlinks.json',
          headers: [{ key: 'Content-Type', value: 'application/json' }],
        },
      ];
    },

    /** NOTE: 실기기 테스트 시 LAN IP를 .env.local의 NEXT_PUBLIC_DEV_ORIGIN에 추가 */
    allowedDevOrigins: process.env.NEXT_PUBLIC_DEV_ORIGIN
      ? [process.env.NEXT_PUBLIC_DEV_ORIGIN]
      : [],
  };
};

export default withSentryConfig(nextConfig, {
  org: 'piki-92',
  project: 'piki-web',
  /** SENTRY_AUTH_TOKEN 이 있을 때만 소스맵 업로드 (CI/Vercel env 주입) */
  silent: !process.env.CI,
  /** 소스맵 업로드 후 클라이언트 번들에서 제거 (원본 코드 노출 방지) */
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  /** Sentry SDK 디버그 로그 제거로 번들 크기 절감 */
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
