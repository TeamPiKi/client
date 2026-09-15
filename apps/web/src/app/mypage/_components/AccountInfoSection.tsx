'use client';

import Link from 'next/link';

import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import LogoutMenuItem from './LogoutMenuItem';

function AccountInfoSection() {
  const { userData } = useGetMe();

  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="body-2-semibold text-text-neutral-secondary">약관 및 정책</h2>
      <div className="flex flex-col divide-y divide-border-neutral-muted rounded-xl bg-bg-layer-default px-4">
        {userData.identityType === 'MEMBER' && <LogoutMenuItem />}
        {userData.identityType === 'MEMBER' && (
          <AccountLinkItem href={ROUTES.MYPAGE_WITHDRAW} label="탈퇴하기" />
        )}
        <AccountLinkItem href={ROUTES.TERMS} label="이용약관" />
        <AccountLinkItem href={ROUTES.POLICY} label="개인정보 처리방침" />
      </div>
    </section>
  );
}

type AccountLinkItemProps = {
  href: string;
  label: string;
};

function AccountLinkItem({ href, label }: AccountLinkItemProps) {
  return (
    <Link
      href={href}
      className="flex w-full cursor-pointer items-center px-2 py-5 body-1-semibold text-text-neutral-secondary"
    >
      {label}
    </Link>
  );
}

export default AccountInfoSection;
