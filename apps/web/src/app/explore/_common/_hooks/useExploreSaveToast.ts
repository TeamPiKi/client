import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TOAST_ACTION_DURATION_MS } from '@/components/toast/toast.const';
import { ROUTES } from '@/consts/route';

/** 탐색에서 내 위시로 담은 뒤 띄우는 토스트 */
export const useExploreSaveToast = () => {
  const router = useRouter();

  return (alreadySaved: boolean) =>
    toast(alreadySaved ? '이미 내 위시에 있는 상품이에요' : '내 위시에 상품을 담았어요', {
      duration: TOAST_ACTION_DURATION_MS,
      action: { label: '보러가기', onClick: () => router.push(ROUTES.WISHLIST) },
      /** 전역 액션 버튼은 회색이지만 이 토스트는 시안대로 흰색 */
      classNames: { actionButton: '[&[data-button]]:!text-text-neutral-inverse' },
    });
};
