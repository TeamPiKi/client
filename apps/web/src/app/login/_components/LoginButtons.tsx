'use client';

import type { SocialProviderT } from '@piki/core';
import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import AppleIcon from '@/assets/icons/social/apple.svg';
import GoogleIcon from '@/assets/icons/social/google.svg';
import KakaoIcon from '@/assets/icons/social/kakao.svg';
import Spinner from '@/components/spinner';
import { QUERY_ACTION } from '@/consts/queryAction';
import { useNativeLoginResult } from '@/hooks/useNativeLoginResult';
import {
  getLoginPath,
  getPostLoginRedirectPath,
  isValidLoginRedirectPath,
  setLoginRedirectPath,
} from '@/utils/loginRedirect';
import { refreshClientToken } from '@/utils/refreshClientToken';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { getAuthUrl } from '../_apis/getAuthUrl';
import { usePostGuestLogin } from '../_hooks/usePostGuestLogin';
import SocialLoginButton from './SocialLoginButton';

type LoginButtonsProps = {
  redirect: string | null;
  action: string | null;
  /** Android 웹뷰에서는 false — 네이티브 Apple 로그인이 iOS 전용이라 미노출 */
  showAppleLogin: boolean;
};

function LoginButtons({ redirect, action, showAppleLogin }: LoginButtonsProps) {
  const router = useRouter();
  const validRedirect = isValidLoginRedirectPath(redirect) ? redirect : null;

  const [isGuestRefreshing, setIsGuestRefreshing] = useState(false);
  const [nativePendingProvider, setNativePendingProvider] = useState<SocialProviderT | null>(null);
  const [webPendingProvider, setWebPendingProvider] = useState<SocialProviderT | null>(null);

  const { postGuestLoginMutation, isPostGuestLoginPending } = usePostGuestLogin();
  const handleNativeLoginSettled = useCallback(() => setNativePendingProvider(null), []);
  useNativeLoginResult({ redirect: validRedirect, onSettled: handleNativeLoginSettled });

  useEffect(() => {
    const handleLoginError = () => {
      if (action === QUERY_ACTION.VALUE.SESSION_EXPIRED) {
        toast.error('로그인 정보가 만료됐어요. 다시 로그인해 주세요.');
        router.replace(getLoginPath(validRedirect), { scroll: false });
        return;
      }
      if (action === QUERY_ACTION.VALUE.SOCIAL_LOGIN_ERROR) {
        toast.error('요청을 처리하지 못했어요. 다시 시도해 주세요.');
        router.replace(getLoginPath(validRedirect), { scroll: false });
      }
    };

    /** NOTE: dev 모드에서는 strict mode 로 인해 두 번 실행되는 문제를 방지하기 위해 setTimeout 을 사용 */
    if (process.env.NODE_ENV === 'development') {
      const timer = window.setTimeout(handleLoginError, 0);
      return () => window.clearTimeout(timer);
    }

    handleLoginError();
  }, [action, validRedirect, router]);

  const isGuestPending = isPostGuestLoginPending || isGuestRefreshing;
  const activePendingProvider = nativePendingProvider ?? webPendingProvider;
  const isAnyPending = isGuestPending || activePendingProvider !== null;

  const postNativeMessage = (provider: SocialProviderT) => {
    if (!isWebview()) return false;

    setNativePendingProvider(provider);
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SOCIAL_LOGIN,
      payload: { provider },
    });
    return true;
  };

  const handleSocialLogin = async (provider: SocialProviderT) => {
    if (postNativeMessage(provider)) return;

    setLoginRedirectPath(validRedirect);
    setWebPendingProvider(provider);
    try {
      const { url } = await getAuthUrl(provider, validRedirect);
      window.location.href = url;
    } catch {
      toast.error('요청을 처리하지 못했어요. 다시 시도해 주세요.');
      setWebPendingProvider(null);
    }
  };

  const handleKakaoLogin = () => handleSocialLogin('kakao');
  const handleGoogleLogin = () => handleSocialLogin('google');
  const handleAppleLogin = () => handleSocialLogin('apple');

  /**
   * 게스트 로그인
   *
   * - 기존 게스트 세션 재활용 시도
   * - 재활용 불가 시 새 게스트 발급
   */
  const handleGuestLogin = async () => {
    setLoginRedirectPath(validRedirect);

    setIsGuestRefreshing(true);
    try {
      await refreshClientToken();
      router.replace(getPostLoginRedirectPath());
      return;
    } catch {
      /** 세션 재활용 불가 */
    } finally {
      setIsGuestRefreshing(false);
    }

    postGuestLoginMutation();
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SocialLoginButton
        variant="google"
        icon={<GoogleIcon width={20} height={20} aria-hidden />}
        label="구글 계정으로 시작하기"
        isLoading={activePendingProvider === 'google'}
        disabled={isAnyPending && activePendingProvider !== 'google'}
        onClick={handleGoogleLogin}
      />
      {showAppleLogin && (
        <SocialLoginButton
          variant="apple"
          icon={<AppleIcon width={20} height={20} aria-hidden />}
          label="Apple로 시작하기"
          isLoading={activePendingProvider === 'apple'}
          disabled={isAnyPending && activePendingProvider !== 'apple'}
          onClick={handleAppleLogin}
        />
      )}
      <SocialLoginButton
        variant="kakao"
        icon={<KakaoIcon width={20} height={20} aria-hidden />}
        label="카카오로 시작하기"
        isLoading={activePendingProvider === 'kakao'}
        disabled={isAnyPending && activePendingProvider !== 'kakao'}
        onClick={handleKakaoLogin}
      />

      <button
        type="button"
        disabled={isAnyPending}
        onClick={handleGuestLogin}
        className="mt-7 flex cursor-pointer items-center gap-1.5 body-2-medium text-text-neutral-secondary underline underline-offset-2 disabled:opacity-50"
      >
        {isGuestPending ? <Spinner size={16} /> : null}
        비회원으로 시작하기
      </button>
    </div>
  );
}

export default LoginButtons;
