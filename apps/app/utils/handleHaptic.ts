import { HAPTIC_STYLE, type HapticPayloadT } from '@piki/core';
import * as Haptics from 'expo-haptics';

import { captureError } from '@/utils/captureError';

const IMPACT_STYLE_MAP = {
  [HAPTIC_STYLE.LIGHT]: Haptics.ImpactFeedbackStyle.Light,
  [HAPTIC_STYLE.MEDIUM]: Haptics.ImpactFeedbackStyle.Medium,
  [HAPTIC_STYLE.HEAVY]: Haptics.ImpactFeedbackStyle.Heavy,
  [HAPTIC_STYLE.SOFT]: Haptics.ImpactFeedbackStyle.Soft,
  [HAPTIC_STYLE.RIGID]: Haptics.ImpactFeedbackStyle.Rigid,
} as const;

const NOTIFICATION_TYPE_MAP = {
  [HAPTIC_STYLE.SUCCESS]: Haptics.NotificationFeedbackType.Success,
  [HAPTIC_STYLE.WARNING]: Haptics.NotificationFeedbackType.Warning,
  [HAPTIC_STYLE.ERROR]: Haptics.NotificationFeedbackType.Error,
} as const;

const isImpactStyle = (style: unknown): style is keyof typeof IMPACT_STYLE_MAP =>
  typeof style === 'string' && style in IMPACT_STYLE_MAP;

const isNotificationStyle = (style: unknown): style is keyof typeof NOTIFICATION_TYPE_MAP =>
  typeof style === 'string' && style in NOTIFICATION_TYPE_MAP;

export const handleHaptic = async (payload: HapticPayloadT | undefined) => {
  /** NOTE: 인바운드 payload 는 런타임 검증이 없어 허용 목록 밖 style 은 가벼운 impact 로 처리함 */
  const style: unknown = payload?.style;

  try {
    if (style === HAPTIC_STYLE.SELECTION) return await Haptics.selectionAsync();
    if (isNotificationStyle(style))
      return await Haptics.notificationAsync(NOTIFICATION_TYPE_MAP[style]);
    if (isImpactStyle(style)) return await Haptics.impactAsync(IMPACT_STYLE_MAP[style]);
    return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    captureError(error, { tags: { source: 'webBridge' }, extra: { style } });
  }
};
