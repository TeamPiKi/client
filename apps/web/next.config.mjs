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
          loaders: ['@svgr/webpack'],
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

    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
        },
      ];
    },

    /** NOTE: 실기기 테스트 시 LAN IP를 .env.local의 NEXT_PUBLIC_DEV_ORIGIN에 추가 */
    allowedDevOrigins: process.env.NEXT_PUBLIC_DEV_ORIGIN
      ? [process.env.NEXT_PUBLIC_DEV_ORIGIN]
      : [],
  };
};

export default nextConfig;
