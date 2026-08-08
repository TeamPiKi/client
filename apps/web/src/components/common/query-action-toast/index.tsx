'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { QUERY_ACTION, type QueryActionValueT } from '@/consts/queryAction';
import { QUERY_ACTION_TOAST } from '@/consts/queryActionToast';

/**
 * `?action=` 으로 넘어온 안내 토스트를 노출하고 쿼리를 URL 에서 제거한다.
 *
 * 도착지와 무관하게 동작하므로 루트에 한 번만 마운트한다.
 * 문구는 `QUERY_ACTION_TOAST` 가 단일 소스 — 새 안내는 이 파일을 고칠 필요가 없다.
 */
function QueryActionToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const action = searchParams.get(QUERY_ACTION.KEY);
  const toastEntry = action ? QUERY_ACTION_TOAST[action as QueryActionValueT] : null;

  useEffect(() => {
    if (!toastEntry) return;

    toast[toastEntry.variant](toastEntry.message);
    router.replace(pathname, { scroll: false });
  }, [toastEntry, pathname, router]);

  return null;
}

export default QueryActionToast;
