import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type {
  NotificationSsePayloadT,
  TournamentItemParsedSsePayloadT,
} from '@/types/notification';
import { getCookie } from '@/utils/cookie';
import { refreshClientToken } from '@/utils/refreshClientToken';
import { isWebview } from '@/utils/webBridge';

const MAX_RETRY_DELAY_MS = 30_000;

const resolveDeepLink = (payload: NotificationSsePayloadT): string | null => {
  const { type, refId, kind, tournamentId } = payload;

  switch (type) {
    case 'TOURNAMENT_STARTED':
      return ROUTES.TOURNAMENT_CREATE(refId);
    case 'TOURNAMENT_JOINED':
    case 'TOURNAMENT_ITEM_ADDED':
      return `${ROUTES.TOURNAMENT_CREATE(refId)}?scrollToLast=true`;
    case 'ITEM_PARSING_COMPLETED':
    case 'ITEM_PARSING_FAILED':
      if (kind === 'TOURNAMENT' && tournamentId != null) {
        return `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?scrollToLast=true`;
      }
      return ROUTES.ARCHIVE_BASE;
    default:
      return null;
  }
};

export const useNotificationSSE = (enabled: boolean) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const retryDelayRef = useRef(1_000);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      const controller = new AbortController();
      abortRef.current = controller;

      const accessToken = getCookie('access_token');
      const isApp = isWebview();

      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
        'X-Client-Type': isApp ? CLIENT_TYPE.APP : CLIENT_TYPE.WEB,
      };

      if (isApp && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      // 웹: Route Handler 경유 (Next.js rewrite 버퍼링 우회, 서버사이드에서 auth 처리)
      // 앱: 기존 rewrite 경로 사용 (Authorization 헤더로 직접 인증)
      const url = isApp ? ENDPOINTS.NOTIFICATIONS_SUBSCRIBE : '/api/notifications/subscribe';

      fetchEventSource(url, {
        headers,
        credentials: 'include',
        signal: controller.signal,
        openWhenHidden: true,

        onopen: async response => {
          if (response.ok) {
            retryDelayRef.current = 1_000;
            return;
          }
          if (response.status === 401) {
            // 토큰 만료 시 공유 refresh 함수를 통해 갱신 후 재연결.
            // 단일 진입점 — page request / API 호출과 같은 dedupe 큐를 공유한다.
            // (직접 fetch 로 호출하면 동시 다발 race 로 백엔드가 401/500 거부 → 사용자 로그아웃)
            try {
              await refreshClientToken();
              // refresh 성공 → onerror backoff 로 재연결
              throw new Error('token-refreshed');
            } catch (err) {
              if (err instanceof Error && err.message === 'token-refreshed') throw err;
              // refresh 실패 (만료 등) → 연결 중단
              cancelled = true;
              throw new Error('unauthorized');
            }
          }
          throw new Error(`SSE open failed: ${response.status}`);
        },

        onmessage: event => {
          if (event.event === 'tournament-item-parsed') {
            try {
              const payload = JSON.parse(event.data) as TournamentItemParsedSsePayloadT;
              queryClient.invalidateQueries({ queryKey: ['tournament', payload.tournamentId] });
            } catch {
              // malformed JSON — 무시
            }
            return;
          }

          if (event.event === 'notification') {
            try {
              const payload = JSON.parse(event.data) as NotificationSsePayloadT;
              const deepLink = resolveDeepLink(payload);
              const action = deepLink
                ? { label: '바로가기', onClick: () => router.push(deepLink) }
                : void 0;

              switch (payload.type) {
                case 'ITEM_PARSING_COMPLETED':
                  if (payload.kind === 'TOURNAMENT' && payload.tournamentId != null) {
                    queryClient.invalidateQueries({
                      queryKey: ['tournament', payload.tournamentId],
                    });
                  } else if (payload.kind === 'WISH') {
                    queryClient.invalidateQueries({ queryKey: ['wishlists'] });
                  }
                  toast.success(payload.title, { description: payload.body || void 0 });
                  break;
                case 'ITEM_PARSING_FAILED':
                  if (payload.kind === 'TOURNAMENT' && payload.tournamentId != null) {
                    queryClient.invalidateQueries({
                      queryKey: ['tournament', payload.tournamentId],
                    });
                  } else if (payload.kind === 'WISH') {
                    queryClient.invalidateQueries({ queryKey: ['wishlists'] });
                  }
                  toast.error(payload.title, {
                    description: payload.body || void 0,
                    action,
                    duration: 5000,
                  });
                  break;
                case 'TOURNAMENT_STARTED':
                case 'TOURNAMENT_JOINED':
                case 'TOURNAMENT_ITEM_ADDED':
                case 'TOURNAMENT_ITEM_DELETED':
                  queryClient.invalidateQueries({ queryKey: ['tournament', payload.refId] });
                  toast.info(payload.title, {
                    description: payload.body || void 0,
                    action,
                    duration: 5000,
                  });
                  break;
                default:
                  toast.info(payload.title, {
                    description: payload.body || void 0,
                    action,
                    duration: 5000,
                  });
              }
            } catch {
              // malformed JSON — 무시
            }
          }
        },

        onerror: err => {
          if (cancelled) throw err; // fetchEventSource 재시도 중단

          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 2, MAX_RETRY_DELAY_MS);

          // throw하면 fetchEventSource가 재시도 멈춤 → setTimeout으로 수동 재연결
          controller.abort();
          setTimeout(connect, delay);
          throw err;
        },
      });
    };

    connect();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [enabled, router, queryClient]);
};
