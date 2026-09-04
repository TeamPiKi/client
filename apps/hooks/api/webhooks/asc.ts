import { updateReleaseThread } from '../../lib/release.js';
import { verifySignature } from '../../lib/verify.js';

type AscWebhookPayloadT = {
  data?: {
    type?: string;
    attributes?: {
      oldState?: string;
      newState?: string;
      oldValue?: string;
      newValue?: string;
    };
  };
};

type VersionStateT = {
  status: string;
  log: string;
  final?: { emoji: string; text: string };
};

/** 심사 대기·통과·출시·반려만 기록 — 수동/자동 출시는 통과 후 전이로 드러난다 */
const VERSION_STATE: Record<string, VersionStateT> = {
  WAITING_FOR_REVIEW: { status: '📮 대기 중', log: '📮 심사 대기 중' },
  ACCEPTED: { status: '✅ 통과', log: '✅ 심사 통과' },
  PENDING_DEVELOPER_RELEASE: {
    status: '✅ 통과 — 수동 출시 대기',
    log: '✅ 심사 통과 — 수동 출시 대기',
  },
  PROCESSING_FOR_DISTRIBUTION: { status: '🚚 출시 처리 중', log: '🚚 출시 처리 중 (자동 출시)' },
  READY_FOR_DISTRIBUTION: {
    status: '🎉 출시 완료',
    log: '🎉 출시 완료!',
    final: { emoji: '🎉', text: '출시 완료!' },
  },
  READY_FOR_SALE: {
    status: '🎉 출시 완료',
    log: '🎉 출시 완료!',
    final: { emoji: '🎉', text: '출시 완료!' },
  },
  REJECTED: { status: '❌ 반려', log: '❌ 심사 반려', final: { emoji: '❌', text: '심사 반려' } },
  METADATA_REJECTED: {
    status: '❌ 반려 (메타데이터)',
    log: '❌ 심사 반려 (메타데이터)',
    final: { emoji: '❌', text: '심사 반려' },
  },
};

/** App Store Connect 웹훅 — TestFlight 빌드 처리·심사 상태 전이를 배포 스레드에 기록 */
export async function POST(request: Request) {
  const secret = process.env.ASC_WEBHOOK_SECRET;
  if (!secret) {
    console.error('ASC_WEBHOOK_SECRET 환경변수가 없습니다');
    return Response.json({ error: 'server misconfigured' }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get('x-apple-signature'), secret, 'sha256')) {
    return Response.json({ error: 'invalid signature' }, { status: 401 });
  }

  let payload: AscWebhookPayloadT;
  try {
    payload = JSON.parse(rawBody) as AscWebhookPayloadT;
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  const eventType = payload.data?.type ?? '';
  const attributes = payload.data?.attributes ?? {};
  /** 이벤트별로 attributes 키가 다르다 (build: newState, version: newValue) */
  const newState = attributes.newState ?? attributes.newValue ?? '';
  const oldState = attributes.oldState ?? attributes.oldValue ?? '';

  let update: Parameters<typeof updateReleaseThread>[0] | null = null;
  if (eventType === 'buildUploadStateUpdated') {
    if (newState === 'COMPLETE') {
      update = {
        log: '✅ TestFlight 빌드 처리 완료 — 테스트 배포 가능',
        /** ASC 페이로드로는 어느 빌드인지 알 수 없어 건수로 집계한다 */
        line: { key: 'TestFlight 처리', value: prev => `${(parseInt(prev ?? '', 10) || 0) + 1}건 완료` },
      };
    } else if (newState === 'FAILED') {
      update = { log: '❌ TestFlight 빌드 처리 실패' };
    }
  } else if (eventType === 'appStoreVersionAppVersionStateUpdated') {
    const state = VERSION_STATE[newState];
    if (state) {
      update = {
        log: oldState ? `${state.log}\n• 상태: \`${oldState}\` → \`${newState}\`` : state.log,
        line: { key: '심사', value: state.status },
        final: state.final,
      };
    }
  }

  /** ping·미구독 이벤트·매핑 없는 상태는 200 으로 무시 (재시도 유발 금지) */
  if (!update) {
    return Response.json({ ok: true, skipped: `${eventType}:${newState}` });
  }

  try {
    await updateReleaseThread(update);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'discord update failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
