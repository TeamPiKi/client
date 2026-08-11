import PriceUpdateImage from '@/assets/images/app-update-price.svg';

/**
 * 앱 업데이트 유도 모달 콘텐츠 — 다음 유도 때 이 상수를 통째로 갈아끼운다.
 *
 * ⚠️ targetVersion 은 해당 버전이 양 스토어에 실제로 게시된 뒤에 올린다.
 * iOS/Android 릴리즈 시점이 벌어지면 늦은 쪽 기준으로 맞춘다.
 */
export const APP_UPDATE_PROMPT = {
  targetVersion: '1.2.0',
  badge: 'NEW',
  title: '가격 정보 업데이트',
  description: '이제 등록한 상품의 최신 가격을\n불러올 수 있어요',
  Illustration: PriceUpdateImage,
} as const;
