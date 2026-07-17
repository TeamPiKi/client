'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { type ReactNode } from 'react';

import NavigationOverlay from '@/components/navigation-overlay';
import NotificationSSEProvider from '@/components/notification-sse-provider';
import { Toaster } from '@/components/toast';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useDeepLink } from '@/hooks/useDeepLink';
import { useFcmTokenSync } from '@/hooks/useFcmTokenSync';
import { getQueryClient } from '@/utils/queryClient';

/** Production 빌드에서는 React Query Devtools 미포함 */
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(() =>
        import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtools }))
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

  return (
    <QueryClientProvider client={queryClient}>
      <FcmTokenSyncer />
      <DeepLinkHandler />
      <AppNavigateHandler />
      {children}
      <NotificationSSEProvider />
      <Toaster />
      {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default Providers;
