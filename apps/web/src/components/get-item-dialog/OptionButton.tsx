'use client';

import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';

import { DialogClose } from '@/components/dialog';

type OptionItemBaseT = {
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type OptionButtonLinkPropsT = OptionItemBaseT & {
  href: string;
  onClick?: never;
};

type OptionButtonButtonPropsT = OptionItemBaseT & {
  onClick: () => void;
  href?: never;
};

type OptionButtonPropsT = OptionButtonLinkPropsT | OptionButtonButtonPropsT;

const optionItemClassName =
  'flex cursor-pointer w-full items-center gap-4 rounded-[12px] border border-border-neutral-muted bg-bg-layer-default px-5 pt-4 pb-[15px] transition-colors active:bg-gray-50';

/**
 * 위시템 담기 다이얼로그 버튼
 *
 * 활용 예시
 * - 위시에서 가져오기 (Link)
 * - 링크로 담기, 이미지로 담기 (Button)
 * */
function OptionButton({ label, description, Icon, ...props }: OptionButtonPropsT) {
  const content = (
    <>
      <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-gray-50">
        <Icon className="size-5 text-icon-neutral-primary" />
      </span>
      <span className="flex flex-col items-start gap-1">
        <span className="body-1-semibold text-text-neutral-primary">{label}</span>
        <span className="body-2-regular text-text-neutral-secondary">{description}</span>
      </span>
    </>
  );

  return (
    <li>
      {'href' in props && props.href ? (
        <Link href={props.href} className={optionItemClassName}>
          {content}
        </Link>
      ) : (
        <DialogClose asChild>
          <button type="button" onClick={props.onClick} className={optionItemClassName}>
            {content}
          </button>
        </DialogClose>
      )}
    </li>
  );
}

export default OptionButton;
