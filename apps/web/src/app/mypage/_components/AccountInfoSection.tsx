'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

import LogoutMenuItem from './LogoutMenuItem';

function AccountInfoSection() {
  const { userData } = useGetMe();

  return (
    <div className="flex w-full flex-col gap-6">
      <MenuGroup title="약관 및 정책">
        <AccountLinkItem href={ROUTES.TERMS} label="이용약관" />
        <AccountLinkItem href={ROUTES.POLICY} label="개인정보 처리방침" />
      </MenuGroup>

      {/** 게스트는 로그아웃·탈퇴 대상이 없어 계정 그룹 자체를 노출하지 않는다 */}
      {userData.identityType === 'MEMBER' && (
        <MenuGroup title="계정">
          <LogoutMenuItem />
          <AccountLinkItem href={ROUTES.MYPAGE_WITHDRAW} label="탈퇴하기" />
        </MenuGroup>
      )}
    </div>
  );
}

type MenuGroupProps = {
  title: string;
  children: ReactNode;
};

function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="body-2-semibold text-text-neutral-secondary">{title}</h2>
      <div className="flex flex-col gap-2 divide-y divide-border-neutral-muted rounded-xl bg-bg-layer-default px-4 py-2">
        {children}
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
      className="flex w-full cursor-pointer items-center px-2 py-2 body-1-medium text-text-neutral-primary"
    >
      {label}
    </Link>
  );
}

export default AccountInfoSection;
