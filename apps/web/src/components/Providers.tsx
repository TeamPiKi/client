'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { type ReactNode, Suspense } from 'react';

import QueryActionToast from '@/components/common/query-action-toast';
import NavigationOverlay from '@/components/navigation-overlay';
import NotificationSSEProvider from '@/components/notification-sse-provider';
import { Toaster } from '@/components/toast';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useTrackAppHistoryDepth } from '@/hooks/useBackWithFallback';
import { useDeepLink } from '@/hooks/useDeepLink';
import { useFcmTokenSync } from '@/hooks/useFcmTokenSync';
import { getQueryClient } from '@/utils/queryClient';

/** Production 빌드에서는 React Query Devtools 미포함 */
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(mod => ({
            default: mod.ReactQueryDevtools,
          })),
        { ssr: false }
      )
    : null;

function FcmTokenSyncer() {
  useFcmTokenSync();
  return null;
}

function DeepLinkHandler() {
  useDeepLink();
  return null;
}

function AppNavigateHandler() {
  const { isNavigatePending } = useAppNavigate();
  return isNavigatePending ? <NavigationOverlay /> : null;
}

function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = getQueryClient();

  useTrackAppHistoryDepth();

  return (
    <QueryClientProvider client={queryClient}>
      <FcmTokenSyncer />
      <DeepLinkHandler />
      <AppNavigateHandler />
      {/* NOTE: children 보다 먼저 마운트해 페이지 마운트 시 토스트가 뜨지 않는 오류 방지 */}
      <Toaster />
      {children}
      <NotificationSSEProvider />

      {/* NOTE: useSearchParams 가 페이지 전체를 클라이언트 렌더로 끌어내리지 않도록 Suspense 경계 사용*/}
      <Suspense fallback={null}>
        <QueryActionToast />
      </Suspense>

      {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default Providers;
