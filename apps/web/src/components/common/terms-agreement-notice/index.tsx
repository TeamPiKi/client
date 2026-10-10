import Link from 'next/link';

import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';

type TermsAgreementNoticeProps = {
  action: string;
  className?: string;
};

const LINK_CLASS_NAME =
  'underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]';

function TermsAgreementNotice({ action, className }: TermsAgreementNoticeProps) {
  return (
    <p className={cn('caption-1-semibold text-text-neutral-tertiary', className)}>
      {action} 시{' '}
      <Link href={ROUTES.TERMS} className={LINK_CLASS_NAME}>
        이용약관
      </Link>
      {' 및 '}
      <Link href={ROUTES.POLICY} className={LINK_CLASS_NAME}>
        개인정보 처리방침
      </Link>
      에 동의하게 됩니다.
    </p>
  );
}

export default TermsAgreementNotice;
