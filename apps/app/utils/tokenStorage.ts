import { isFresherToken } from '@piki/core';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * NOTE: PiKi 앱과 Share Extension(iOS 앱 공유 바텀시트)에서 access, refresh token을 공유하기 위해 App Group 사용
 */
const getSecureStoreOptions = (): SecureStore.SecureStoreOptions =>
  Platform.OS === 'ios' ? { accessGroup: 'group.day.no30s.piki' } : {};

export const TokenStorage = {
  /** 저장된 refresh 보다 최신일 때만 저장 */
  async setTokens(accessToken: string, refreshToken: string) {
    const storedRefreshToken = await TokenStorage.getRefreshToken();

    if (storedRefreshToken === refreshToken) return;
    if (storedRefreshToken && !isFresherToken(refreshToken, storedRefreshToken)) return;

    const options = getSecureStoreOptions();

    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, options),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, options),
    ]);
  },

  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY, getSecureStoreOptions());
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY, getSecureStoreOptions());
  },

  async clearTokens() {
    const options = getSecureStoreOptions();

    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, options),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, options),
    ]);
  },
};
